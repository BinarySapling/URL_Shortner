# SNIP - Enterprise URL Shortener Architecture

[Live Demo](https://snip.software/)

SNIP is a high-performance, distributed URL shortening microservice architecture. Expanding beyond standard monolithic designs, the system utilizes an advanced networking stack to guarantee rapid redirection, fault tolerance, and comprehensive edge-case handling engineered for authentic production scale.

## Core Infrastructure

![Landing Page Interface](docs/snip_landing_page.png)

*   **Microservices Approach**: The framework is decoupled into an isolated `Shortener Service` and an independent `Redirector Service`. This isolates write-heavy administrative API traffic from read-heavy public redirect traffic, allowing asymmetrical horizontal scaling via Docker Compose.
*   **Cache-Aside Redirection**: Redirection latency is strictly minimized via Redis. Leveraging Node `perf_hooks` for diagnostic profiling, the platform ensures sub-millisecond cached lookups, vastly reducing MongoDB document payload reads.
*   **Zero-Collision Hash Identifiers**: To circumvent hash collisions and race conditions inherent in naive string hashing, the system implements an atomic Redis Sequence Counter mapped against a Base62 Hashids engine. This guarantees distributed, constant-time generation without duplicates.
*   **Idempotency Locks**: Concurrent submission spikes map via Redis-based Idempotency Identifiers, gracefully mitigating database bottlenecking and preventing duplicate document inserts during viral traffic hits.

## Security & Reliability Profile

*   **Atomic Rate Limiting**: The API defends against localized Denial of Service mapping using sliding-window rate limiters, evaluated synchronously within non-blocking Redis Pipelines.
*   **Phishing Defense**: Validated securely against the Google Safe Browsing API, the service conducts proactive threat assessments prior to generation, supported by a rapid local TLD blacklist for high-risk domains.
*   **Data Lifecycle**: Strict platform governance enforces a maximum 90-day time-to-live (TTL) on all active routes, maintaining lean storage infrastructure. 

## Engineered Edge Handling

![Custom 410 Recovery Interface](docs/snip_oops_page.png)

A major focus of the core implementation targets rigorous edge constraints commonly evaluated in high-level system designs:

*   **Graceful 410 "Gone" Automation**: Rather than hard-deleting expired payloads instantly, the infrastructure leverages MongoDB TTL offsets to evaluate expired state logically. Expired resources generate strict HTTP `410 Gone` tags, informing web crawlers of intentional deprecation and preserving domain SEO integrity.
*   **Recursive Cycle Prevention**: Stringent domain validation intercepts cyclical routing parameters. The application prevents internal looping by hard-blocking users from parsing URLs hosted on the service's primary domain registry.
*   **Protocol Normalization**: The validation pipelines proactively detect and normalize malformed user input, safely auto-injecting TLS schemes where raw data attempts to crash the parser.
*   **Native Error Integration**: Unhandled internal exceptions and 500 Server Errors gracefully trigger HTTP 302 pathways back into the React SPA. This presents end-users with contextual recovery screens instead of exposing raw backend JSON to consumer browser environments.
