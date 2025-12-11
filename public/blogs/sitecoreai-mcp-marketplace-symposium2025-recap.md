# SitecoreAI, Marketer MCP, Agents API, Marketplace — Sitecore Symposium 2025 Recap

I was lucky enough to attend **Sitecore Symposium 2025**, and now that it’s over and we’re all back to work, Sitecore has already released **SitecoreAI** — so it’s time to sum up and review what actually happened!

---

#### SitecoreAI

When the cloud boom started, Sitecore introduced **XM Cloud**. When the AI boom began, Sitecore brought us **Sitecore Stream**. Now Sitecore goes even further and introduces something truly transformative: **SitecoreAI**.

![SitecoreAI Transformation](/images/2025/sym/sitecoreai_transformation.png)

_Note_. Sitecore AI doesn’t replace the existing DXP products — it unifies them into a single, AI-powered connected platform.

![SitecoreAI](/images/2025/sym/sitecoreai.png)

- No more disconnected products in the portfolio — you get **everything in one unified interface**: XM Cloud, Personalize/CDP, Search, Content Hub, and more.
- No more questions like “How do I add AI here or there?” — **AI is now built directly into the platform**.
- **Content is king**: As the web transforms in the age of AI (and perhaps traditional websites will soon evolve into something new), you now need to think not only about SEO, but also AEO/GEO. Content matters more than ever — and SitecoreAI puts content front and center.

![Agentic SitecoreAI](/images/2025/sym/sitecoreai-agentic.png)

**SitecoreAI is Agentic**, introducing a range of powerful AI capabilities:

- **Agentic Studio** — a workspace to build and connect your AI agents. You can include human feedback or confirmation at any stage, allowing you to refine content early in the process.
- **Signals** — customizable entities that monitor global events or trends. Configure your own signals and let AI track the web with personalized insights.
- **Flows** — combine your custom or existing agents and run them with your inputs — perfect for automating AI-driven tasks like **ABM campaigns**.

All of this became possible because Sitecore has unified its data layer — everything now runs on **Azure**.

**SitecoreAI is here and ready to use!**

_P.S._ Even the Sitecore Slack “XM Cloud” channel has been renamed to **#sitecoreai**.

---

#### AI Capabilities

![SitecoreAI MCP](/images/2025/sym/sitecoreai_mcp.png)

Sitecore showcased its collaboration with [Gradial](https://www.sitecore.com/partners/solution-catalog/ai-agents-that-accelerate-marketing-workflows-with-sitecore-and-gradial), demonstrating how content management can be simplified with AI. However, Sitecore doesn’t want to limit your options to a single partner solution — instead, the same tools Gradial used in their integration are now available for everyone to build upon.

##### Sitecore Interoperability

**Interoperability** means that Sitecore can seamlessly connect and work with other systems — without requiring complex rebuilds.

[Sitecore Interoperability](https://doc.sitecore.com/sai/en/users/sitecoreai/integrating-sitecore-with-agentic-platforms.html#sitecore-interoperability) includes:

- **Partner integrations** — solutions from partners that extend Sitecore into wider ecosystems.  
- **APIs and developer tools** — providing consistent and reliable connectivity.  
- **Future-ready design** — frameworks that support emerging technologies, including agentic and generative AI platforms.  

Check out the tools below that you can already use to connect Sitecore with AI.

##### Marketer MCP

The [Marketer MCP](https://doc.sitecore.com/sai/en/users/sitecoreai/marketer-mcp.html) (Model Context Protocol) enables marketing-focused interoperability in Sitecore. It connects AI agents to Sitecore tools through the [Agent API](https://api-docs.sitecore.com/ai-capabilities/agent-api), providing secure access across the entire digital experience lifecycle.

With MCP, you can perform operations such as:

- Creating pages and updating page designs using natural language requests  
- Personalizing components  
- Searching for and updating assets  

Check the [Sitecore documentation](https://doc.sitecore.com/sai/en/users/sitecoreai/marketer-mcp.html#marketer-mcp-tools-reference) for the full list of available tools.

##### Agents API

The **Agent API** allows AI agents to take direct action in Sitecore through secure REST endpoints. It supports common digital experience operations such as creating pages, adding components, and updating content.

You might ask: “Why does Sitecore need another API when GraphQL already exists?”  
While GraphQL and other **atomic APIs** are great for programming, they’re not ideal for interaction with **LLMs (Large Language Models)**. The **Agent API** is an **extension** over existing Sitecore APIs, designed specifically for **AI agents and LLMs**.

Key features include:

- **Site** search and retrieval operations  
- **Page** operations (create page, add component, add data source, etc.)  
- **Asset** search and retrieval  
- **Revertability** — any operation can be undone using the `x-sc-job-id` header  

##### Usage

You can connect to MCP from well-known AI clients (like **Claude** or **GitHub Copilot**) or integrate it into any AI agent framework (for example, [MCP tools](https://ai-sdk.dev/cookbook/node/mcp-tools) in the **Vercel AI SDK**).

Alternatively, you can use the **Agent API** directly for more predictable and controllable integrations.

Both MCP and the Agent API are part of Sitecore’s broader [interoperability](https://doc.sitecore.com/sai/en/users/sitecoreai/marketer-mcp-and-agent-api-overview.html) framework for AI agents.

---

#### Marketplace

![Sitecore Marketplace](/images/2025/sym/marketplace.png)

The new [Sitecore Marketplace](https://doc.sitecore.com/mp/en/developers/marketplace/introduction-to-sitecore-marketplace-for-custom-and-public-apps.html) introduces a whole new way to extend SitecoreAI — and a new way for partners to collaborate and position themselves in the Sitecore ecosystem.  

You can now choose whether to:
- Build **public apps** for everyone, or  
- Develop **private extensions** tailored to specific clients.

In the XM/XP world, we extended Sitecore using config patches and modules. Now, we do it through **Marketplace Apps**.

Here are some great starting points:

- [Sitecore Marketplace Developer Basics](https://learning.sitecore.com/learn/courses/1502/sitecore-marketplace-developer-basics) — an e-learning course covering Marketplace app fundamentals  
- [Marketplace SDK](https://github.com/Sitecore/marketplace-sdk) — the official SDK for building apps  
- [Marketplace Starter](https://github.com/Sitecore/marketplace-starter) — a starter template for building Marketplace extensions  
- [Shadcn Blok Registry](https://blok.sitecore.com/beta) — Sitecore’s new product design system, now available as a shadcn component registry  

An early example of a Marketplace App is **Pathway** (by Sitecore) — a migration tool that will soon be available. Initially, it will support migration from XP to SitecoreAI (formerly XM Cloud), and later it will simplify migration **from any CMS to SitecoreAI**.

The best part? Sitecore itself uses the same SDK internally to build many of its own apps — ensuring continuous improvement and long-term support for the SDK.

---

### Conclusion

Have you started exploring these new features yet? Share your feedback — through blog posts, comments, or messages on Slack — the Sitecore team is eager to hear from you.

This year’s Symposium was one of the biggest yet in terms of announcements, innovation, and direction. The investments Sitecore is making are clear and well-focused — and they’re setting the foundation for what’s next.

![Next is now with Sitecore](/images/2025/sym/next_is_now.png)

**Next is now — with Sitecore.**



