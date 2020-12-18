# wiz-editor 多人实时编辑器服务端架构介绍

## 功能

wiz-editor 多人实时编辑服务，本质上是一个具有操作变换能力的实时JSON数据库。服务器有能力接受多个客户端对同一JSON数据的修改，对这些修改进行计算，然后生成针对每个客户端独特的计算函数，将函数发给客户端去执行，确保执行后得到一致的结果。

![](./assets/server-architecture-2.png?raw=true)

服务器会提供与实时协同编辑有关的以下能力：

 - 接收多个客户端提交的数据修改(编辑行为)
 - 对客户端提交的修改行为进行临时存储(可配置有效时间)，当有临时网络中断的客户端重新连接时，需要使用这些数据
 - 基于多个客户端的数据修改行为，计算并生成文档的最新版本
 - 基于数据修改，对数据修改进行计算与转换后，再返回给各客户端，由客户端基于这些数据生成多端一致的文档数据
 - 针对富文本的修改，做了专门的计算与转换支持，使用json结构表达富文本中的文字、属性等，并支持多端修改的合并
 - 对文档的最新版本进行保存
 - 对文档的历史版本进行保存
 - 对文档相关的资源文件(图片等附件)进行保存，并与版本关联
 - 生成文档对应的文本格式(用于全文索引)
 - 基于JWT token的权限认证

服务器 **不提供** 与编辑无关的能力，比如：用户管理、文档标签、文档父子关系、文件夹等。

## 核心数据结构

服务器端的核心数据结构包括：

### 1. appId, docId与appSecret

appId是分配给每个租户的一个唯一标识。

docId是文档的标识。appId与docId合在一起，就可以定位到一篇文档。

appSecret是与appId对应的密钥。访问服务器的所有功能，都需要在请求中包含基于appId和appSecret生成的token。

具体的token生成可参考 [wiz-editor 服务端适配](./server.md)

### 2. 文档结构

文档采用JSON的格式进行存储。一个文档中可以包含多个容器，每个容器中包含一个block数组，每个block对应编辑器中的一个块。

block的核心属性是 id 和 type，每个不同 type 的block，会有不同的数据保存在其中，由这个 type 对应的处理逻辑进行处理。一个合法的文档结构如下：

```json
{
    "blocks": [
        {
            "id": "_JNROVvJr",
            "type": "text",
            "text": []
        },
        {
            "text": [],
            "id": "_zkCPs_Hx",
            "type": "table",
            "rows": 1,
            "cols": 2,
            "cells": [
                "_m63A1XwJ",
                "_HNSbtTa2",
            ]
        },
        {
            "id": "_8vVxQePS",
            "type": "embed",
            "text": null,
            "embedType": "image",
            "embedData": {
                "src": "https://wcdn.wiz.cn/apple-icon.png?v=1"
            }
        },
        {
            "text": [
            ],
            "id": "_vA0otj0I",
            "type": "text"
        },
        {
            "text": [
                {
                    "attributes": {
                        "box": true,
                        "id": "_TTP4Hi4W",
                        "type": "date",
                        "text": "2020/12/18"
                    },
                }
            ],
            "id": "_ns681KAt",
            "type": "text"
        },
        {
            "id": "_nYn2rkcL",
            "type": "embed",
            "text": null,
            "embedType": "mermaid",
            "embedData": {
                "mermaidText": "\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n"
            }
        },
    ],
    "_m63A1XwJ": [
        {
            "id": "_pablk9PL",
            "type": "embed",
            "text": null,
            "embedType": "image",
            "embedData": {
                "src": "https://wcdn.wiz.cn/apple-icon.png?v=1"
            }
        },
        {
            "text": [],
            "id": "_KPGOsP3s",
            "type": "text"
        }
    ],
}
```

## 数据持久化结构

数据持久化分为几个不同的存储引擎(适配器)：
 - 用户操作存储
 - 文档最终版本存储
 - 文档历史版本存储
 - 附件存储

其中用户操作存储是临时存储，支持存储于redis或数据库中。其它几个存储都是持久化存储。

所有的元数据存储，都支持sqlite、mysql和mongodb三种引擎。文档与附件存储，支持保存副本至对象存储，并按LRU策略清理本地存储。在用户重新编辑的时候，会自动取回本地。

## 网络协议与接口

网络协议使用websocket协议进行实时通信，对于一些功能性API，使用restful方式提供接口。

websocket支持启用https和压缩

## 负载均衡与高可用

服务器架构设计上充分考虑了性能与高可用的需求，整体架构如下：

![](assets/server-architecture-1.png?raw=true)

图中wiz-editor client访问时，每个请求中都需要包含appId和docId信息，请求到达负载均衡后，会基于一致性哈希算法，将请求分配到一个wiz-editor server上。

当后端有服务器down了之后，负载均衡会基于配置好的健康检查策略，将请求转发至新的服务器上。新的服务器会基于后端的redis/数据库/对象存储中存储的数据的最新状态，继续为前端提供服务。

后端也可动态增加新的服务器。增加新的服务器后，负载均衡会自动将请求按一致性哈希的算法，在新的服务器组中进行分配。

整个集群对外提供一个统一协同编辑服务，这样的一个集群，可正常服务数十万规模的用户。

如果用户规模特别大，或者有全球部署的需求，也可以部署多个这样的集群，按一定的策略(比如按哈希、地域，或用户自己选择)，将用户分配到不同的集群上。服务器支持数据迁移服务，当用户需要的时候，可以自动将用户的数据在集群之间进行迁移。
