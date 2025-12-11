# Unlocking Sitecore Send for LLMs via the MCP Server

#### Introduction

As LLMs become more popular, they face two main challenges: their knowledge is restricted to what they were trained on (with a knowledge cut-off), and their ability to interact with external tools is often limited. 

**Model Context Protocol (MCP) Servers** address these issues by providing a unified interface for LLMs to communicate with custom APIs, enabling you to supply additional context and tools to the models.

For easy integration with Sitecore Send, I've created a Sitecore Send MCP Server.

In this article, I will show the details of the Sitecore Send MCP Server and provide an example of its usage.

#### Sitecore Send MCP Server (My Implementation)

My implementation of the **Sitecore Send MCP Server** can be found here:  
- [github](https://github.com/izharikov/send-mcp)
- [npm](https://www.npmjs.com/package/send-mcp)

Currently, the following tools are available:
- `send_smtp_email` - send an email using SMTP 
- `get_lists` - get email lists 
- `get_list_members` - get email list members
- `add_list_member` - add a subscriber to an email list
- `remove_list_member` - remove a subscriber from an email list
- `send_transactional_email` - send an email using the transactional email service

Use the following JSON to add the server to any LLM client supporting MCP (GitHub Copilot, Claude, or [any other client](https://modelcontextprotocol.io/clients)):

```json
{
    "send-mcp": {
        "command": "npx",
        "args": [
            "send-mcp"
        ],
        "env": {
            "API_KEY": "xxxxx",
            "TRANSACTIONAL_EMAILS_CAMPAIGN_ID": "xxxxx",
            "SMTP_ENABLED": "true",
            "SMTP_FROM": "xxxxx",
            "SMTP_USER": "xxxxx",
            "SMTP_PASSWORD": "xxxxx"
        }
    }
}
```

#### Connecting to the MCP server

For the LLM client, I use [5ire](https://5ire.app/) (which, of course, supports MCP).

MCP currently supports [two transports](https://modelcontextprotocol.io/docs/concepts/transports):
- `stdio` - connect to the server using standard input and output (run the server locally)
- Streamable HTTP - uses HTTP POST requests for client-to-server communication and optional Server-Sent Events (SSE) streams for server-to-client communication (connect to a remote server)

##### `stdio` transport

If you are using the `stdio` mode, you can connect to the server using the following command:

Command:
```bash
npx -y send-mcp
```

The actual list of environment variables can be observed [here](https://github.com/izharikov/send-mcp?tab=readme-ov-file#environment-variables).

![connecting to the server](/images/2025/send-mcp/connect-to-mcp-stdio.png)

##### Streamable HTTP transport

If you are using the Streamable HTTP mode, you can start the server and connect to it.

1. Create a `.env` file:

```properties
# required properties
API_KEY=[Sitecore Send API Key]
TRANSACTIONAL_EMAILS_CAMPAIGN_ID=[Transactional Emails Campaign ID]
# if you want to use SMTP
SMTP_ENABLED=true
SMTP_FROM=[SMTP email from]
SMTP_USER=[SMTP connection user]
SMTP_PASSWORD=[SMTP connection password]

# optional properties: these are default values, but you can overwrite them
SMTP_HOST=smtp.mailendo.com
SMTP_PORT=25
API_BASE_URL=https://api.sitecoresend.io/v3
```

2. Start the server:
```bash
npx send-mcp http --port 3000
```

3. Connect to the server:

URL to connect (port is specified in CLI, 3000 by default):
```
http://localhost:3000/mcp
```

![connecting to the server](/images/2025/send-mcp/connect-to-mcp-http.png)

##### Retrieve lists and subscribers information

![lists and subscribers information](/images/2025/send-mcp/ask-information.png)

##### Sending an email

As we have the tools `send_smtp_email` and `send_transactional_email`, we can ask the LLM to generate and send an email to a particular subscriber.

Here is an example. When we ask to send an email, the LLM chooses the correct tool and executes it.

![sending an email](/images/2025/send-mcp/mcp-tool-invocation.png)

When the email is sent, we get information about it.

![email sent](/images/2025/send-mcp/mcp-send-email.png)

The email itself looks like this:

![LLM generated email](/images/2025/send-mcp/generated-email.png)

#### Implementation details:
- Language: `TypeScript`
- Framework used: [FastMCP](https://github.com/punkpeye/fastmcp)
- Sitecore Send API Client in TypeScript: [git](https://github.com/izharikov/send-client) or [npm](https://www.npmjs.com/package/send-client)

#### Conclusion

As I just showed, with an MCP server it's possible (and easy!) to connect any LLM to your Sitecore Send instance and use it to get lists and subscriber information, send emails, and much more.

If you have any ideas how this MCP server can be improved, please let me know ([email](mailto:zharikovigor97@gmail.com) me or find me in Sitecore Slack).
