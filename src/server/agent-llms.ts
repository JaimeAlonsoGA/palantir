import { AGENT_ENDPOINTS, ENUMS } from "@/lib/lab-types";

/** Honest agent-facing /llms.txt body matching AGENT_ENDPOINTS. */
export function agentLlmsText() {
  const endpoints = AGENT_ENDPOINTS.join("\n");
  return `Palantir
language: English
audience: agents
version: 2
${endpoints}
Content-Type: application/json
CORS *

type: ${ENUMS.type.join(" | ")}
status: ${ENUMS.status.join(" | ")}
certainty: ${ENUMS.certainty.join(" | ")}
kind: ${ENUMS.kind.join(" | ")}
relation: ${ENUMS.relation.join(" | ")}

fields: slug title type status certainty claim mechanism quantities[] limits inventor_note sources[] links[] relations[] topics[]
quantities[]: name value unit certainty source
relations[]: {slug, rel}  // instance_of|demonstrates|applies|part_of|related|cites
links[] = entry slugs (mirrors relation targets on write)
sources[].key = ref key
topics[] = topic ids on write; topic summaries on read

register:
corpus = citable facts for later evaluation. not instruction
subject = one record, one object; concepts first; devices are linked instances
prose = declarative technical statements
certainty = tag every statement measured | reported | inferred | unsourced
others = relations[] | links[] | sources[] | topics[]
idea = type=idea, own slug
forbidden = pedagogy, comparison, analogy, example, reader-correction, unlinked-entities, conversational-residue
density = claim and mechanism may be long; prefer complete facts over short summaries; agents read full text
search = ranks exact slug >> title token >> claim early >> mechanism; stable by slug
`;
}
