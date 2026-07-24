# Maestro for Cocos Creator

A story engine for building swipeable, scroll-driven interactive stories for the web — webcomics, motion comics, animated zines. Implemented as a plugin for Cocos Creator in TypeScript.

An early implementation in the lineage that became **Scroll Cinema**, my current engine for scroll-driven interactive narrative.

## What it does

Maestro overrides Cocos Creator's animation system to drive playback from user input — swipe and scroll position — rather than from a timeline clock. That inversion is the core of the engine: animation state becomes a pure function of scroll offset, which is what makes stories scrubbable in both directions and resumable at any point.

It also provides a visual logic layer, so non-programmers can build conditional story behavior without writing code.

## Architecture

| Module | Responsibility |
|---|---|
| `sequencing/` | Timeline construction and scroll-position-driven playback |
| `animation/` | Manual override of the Cocos animation system |
| `logic/` | Node-based conditional behavior, authored without code |
| `sensors/` | Input capture — swipe, scroll, and gesture handling |
| `layout/` | Responsive positioning across viewport sizes |
| `audio/` | Sound sequencing tied to timeline position |
| `persistentData/` | Reader state across sessions |

## The Maestro lineage

Three implementations exist, each targeting a different runtime:

| Version | Runtime | Status |
|---|---|---|
| [`maestro-unity`](https://github.com/artemiomorales/maestro-unity) | Unity (C#) | Prototype — superseded |
| **`maestro-cocos`** (this repo) | Cocos Creator (TypeScript) | Prototype — superseded |
| **Scroll Cinema** | Web — React, TypeScript, PixiJS | Active development (private) |

Both engine-based versions ran into the same wall: a closed-source editor constrains the authoring experience, and neither runtime exports efficiently for the open web. The Unity version additionally depends on paid, closed-source packages, and Unity itself is a steep climb for the non-technical authors this tool is meant to serve.

Scroll Cinema is the response — a rebuild on open web technologies, using this codebase as the architectural reference. The module boundaries above carried over largely intact. That work is in a private repository; published output is linked from [artemiomorales.com](https://artemiomorales.com).

## Status

Archived prototype. Retained as the architectural reference for Scroll Cinema. Not under active development.

## License

[Mozilla Public License 2.0](license.txt).

## Author

[Artemio Morales](https://github.com/artemiomorales)
