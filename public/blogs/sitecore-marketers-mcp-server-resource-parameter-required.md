# Fix "Resource parameter is required" error in Sitecore Marketers MCP

[Connecting](https://doc.sitecore.com/sai/en/users/sitecoreai/marketer-mcp.html#setting-up-the-marketer-mcp) new **Marketers MCP** into your LLM client is easy, but with some clients you can face an issue with authorization.

This is how it looks:

![authorization issue](/images/2025/marketers-mcp-issue/issue-authorization.png)

**Fix**: manually append `resource` parameter to the request url.

```txt
&resource=https%3A%2F%2Fedge-platform.sitecorecloud.io%2Fmcp%2Fmarketer-mcp-prod
```

_Note_. The issue is confirmed by Sitecore (currently the documentation is updated). 
Also Sitecore Support is working on better permanent solution (Feature Request **#AI-6473**).

Proposed fix: make `resource` param optional with default value `https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod`
