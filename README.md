# @pipeworx/pexels

[Pexels](https://www.pexels.com/api/documentation/) MCP — photo + video search. Free key 200/hr, 20k/mo.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_PEXELS_KEY`. BYO: `?_apiKey=…`.

## Tools (photos)

- `photo_search(query, orientation?, size?, color?, locale?, page?, per_page?)`
- `photo_curated(page?, per_page?)`
- `photo(id)`

## Tools (videos)

- `video_search(query, orientation?, size?, locale?, page?, per_page?)`
- `video_popular(min_width?, min_height?, min_duration?, max_duration?, page?, per_page?)`
- `video(id)`

## Tools (collections)

- `featured_collections(page?, per_page?)`
- `collection_media(id, type?, sort?, page?, per_page?)`

## Data source

`https://api.pexels.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "pexels": {
      "url": "https://gateway.pipeworx.io/pexels/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Pexels data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
