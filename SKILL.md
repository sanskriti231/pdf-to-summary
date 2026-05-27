---
name: mcp-cli
description: Interface for MCP (Model Context Protocol) servers via CLI. Use when you need to interact with external tools, APIs, databases, filesystems, GitHub, or any MCP-powered service.
---

# MCP-CLI — Complete Agent Skill

Access 15 MCP servers through the command line. MCP enables interaction with GitHub, PostgreSQL, filesystems, databases, UI component libraries, animation tools, SVG rendering, cloud databases, image APIs, and more.

## Prerequisites

```bash
# mcp-cli is installed at: /Users/aryanbatra/.local/bin/mcp-cli
export PATH="$HOME/.local/bin:$PATH"
```

## Commands

| Command | Output |
|---------|--------|
| `mcp-cli` | List all servers and tool names |
| `mcp-cli info <server>` | Show tools with parameters |
| `mcp-cli info <server> <tool>` | Get tool JSON schema |
| `mcp-cli grep "<pattern>"` | Search tools by name |
| `mcp-cli call <server> <tool> '{}'` | Call tool with arguments |

**Both formats work:** `info <server> <tool>` or `info <server>/<tool>`

**Add `-d` to include descriptions** (e.g., `mcp-cli info filesystem -d`)

## Available Servers (15 total)

| Server | Tools | Purpose |
|--------|-------|---------|
| **openspec** | 40+ | Spec management, reviews, change proposals |
| **github** | 24 | GitHub repos, PRs, issues, code search |
| **next-devtools** | 7 | Next.js dev server, browser automation |
| **context7** | 2 | Library/framework documentation lookup |
| **depwire** | 23 | Codebase dependency analysis & architecture |
| **aceternityui** | 5 | Aceternity UI components |
| **magicuidesign-mcp** | 3 | Magic UI components |
| **nakkas** | 3 | SVG rendering & animation |
| **shadcn** | 7 | shadcn/ui component management |
| **gsap-master** | 6 | GSAP animation generation |
| **turso-cloud** | 9 | Turso edge database management |
| **filesystem** | 14 | Read/write/search project files |
| **figma-pilot** | 3 | Figma design tool integration |
| **unsplash** | 3 | Unsplash photo search & download |

## Workflow

1. **Discover**: `mcp-cli` → see available servers and tools
2. **Explore**: `mcp-cli info <server>` → see tools with parameters  
3. **Inspect**: `mcp-cli info <server> <tool>` → get full JSON input schema
4. **Execute**: `mcp-cli call <server> <tool> '{}'` → run with arguments

## Examples

### Filesystem Operations
```bash
# List directory
mcp-cli call filesystem list_directory '{"path": "./src"}'

# Read file
mcp-cli call filesystem read_file '{"path": "./package.json"}'

# Search files
mcp-cli call filesystem search_files '{"path": ".", "pattern": "*.ts"}'
```

### GitHub Operations
```bash
# List issues
mcp-cli call github list_issues '{"owner": "user", "repo": "repo"}'

# Search code
mcp-cli call github search_code '{"q": "function"}'

# Create issue
mcp-cli call github create_issue '{"owner": "user", "repo": "repo", "title": "Bug found"}'
```


### Database (Turso Cloud)
```bash
# List databases
mcp-cli call turso-cloud list_databases '{}'

# Read-only query
mcp-cli call turso-cloud execute_read_only_query '{"query": "SELECT * FROM users LIMIT 10"}'
```

### Codebase Analysis (depwire)
```bash
# Connect to a repo
mcp-cli call depwire connect_repo '{"source": "."}'

# Get architecture summary
mcp-cli call depwire get_architecture_summary '{}'

# Impact analysis
mcp-cli call depwire impact_analysis '{"symbol": "main"}'
```

### UI Components
```bash
# Search shadcn components
mcp-cli call shadcn search_items_in_registries '{"registries": ["@shadcn"], "query": "button"}'

# Get Aceternity UI components
mcp-cli call aceternityui search_components '{"query": "card"}'
```

### Documentation
```bash
# Context7 docs lookup
mcp-cli call context7 resolve-library-id '{"query": "how to use Next.js App Router", "libraryName": "Next.js"}'
mcp-cli call context7 query-docs '{"libraryId": "/vercel/next.js", "query": "App Router layout"}'
```

### SVG/Animation
```bash
# SVG rendering
mcp-cli call nakkas render_svg '{"canvas": {"width": 400, "height": 200}}'

# GSAP animations
mcp-cli call gsap-master understand_and_create_animation '{"request": "fade in cards", "context": "react"}'
```

### Spec Management (openspec)
```bash
# List changes
mcp-cli call openspec openspec_list_changes '{}'

# Create change proposal
mcp-cli call openspec openspec_create_change '{"changeId": "add-new-feature"}'
```

### Chain Commands
```bash
# Search files and read first result
mcp-cli call filesystem search_files '{"path": "src/", "pattern": "*.ts"}' \
  | jq -r '.content[0].text | split("\n")[0]' \
  | xargs -I {} mcp-cli call filesystem read_file '{"path": "{}"}'
```

## Complex JSON with quotes
```bash
# Use heredoc for complex JSON
mcp-cli call server tool <<EOF
{"content": "Text with 'quotes' inside"}
EOF

# Pipe from a file
cat args.json | mcp-cli call server tool
```

## Options

| Flag | Purpose |
|------|---------|
| `-d` | Include descriptions |
| `-c <path>` | Custom config file path (default: `~/.config/mcp/mcp_servers.json`) |

## Exit Codes

- 0: Success
- 1: Client error (bad args, missing config)
- 2: Server error (tool failed)
- 3: Network error