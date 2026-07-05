/**
 * ATS-friendly CV generator.
 *
 * Design rules baked in (from ATS best-practice research):
 *  - SINGLE COLUMN. Multi-column layouts get scrambled by ATS parsers.
 *  - Standard fonts only (Helvetica) + real selectable text, no images/icons.
 *  - Standard section headings ("Experience", "Skills"...) so parsers map them.
 *  - Reverse-chronological experience, strong-verb + quantified bullets.
 *  - One page, tight but readable. Keyword-dense skills line.
 *
 * This module is imported dynamically (browser only) so @react-pdf/renderer
 * never touches the server bundle.
 */
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import {
  profile,
  experiences,
  projects,
  skillGroups,
  education,
  achievements,
  atsSkillKeywords,
  leetcode,
} from "@/data/profile";

const INK = "#111318";
const SUB = "#3f4652";
const ACCENT = "#1f4ed8";
const LINE = "#c9ced8";

const s = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 38,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.35,
  },
  name: { fontSize: 21, fontFamily: "Helvetica-Bold", letterSpacing: 0.3 },
  role: { fontSize: 10.5, color: ACCENT, fontFamily: "Helvetica-Bold", marginTop: 2 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 5, fontSize: 8.5, color: SUB },
  contactItem: { marginRight: 10 },
  link: { color: ACCENT, textDecoration: "none" },

  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginTop: 11,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  summary: { fontSize: 8.9, color: SUB, textAlign: "justify" },

  jobHead: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  jobTitle: { fontSize: 9.6, fontFamily: "Helvetica-Bold" },
  jobCompany: { fontSize: 9, color: ACCENT, fontFamily: "Helvetica-Bold" },
  jobMeta: { fontSize: 8.3, color: SUB, textAlign: "right" },

  bulletRow: { flexDirection: "row", marginTop: 1.6, paddingRight: 4 },
  bulletDot: { width: 8, fontSize: 8.6, color: ACCENT },
  bulletText: { flex: 1, fontSize: 8.6, color: INK },

  projRow: { marginTop: 4 },
  projName: { fontSize: 9.3, fontFamily: "Helvetica-Bold" },
  projTech: { fontSize: 8, color: SUB, fontFamily: "Helvetica-Oblique" },
  projDesc: { fontSize: 8.5, color: INK, marginTop: 1 },

  skillLine: { fontSize: 8.6, marginTop: 1.5 },
  skillCat: { fontFamily: "Helvetica-Bold" },

  eduHead: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  twoColWrap: { flexDirection: "row", justifyContent: "space-between" },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bulletDot}>▪</Text>
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

function CvDoc() {
  const featured = projects.filter((p) => p.featured).slice(0, 5);

  return (
    <Document
      author={profile.name}
      title={`${profile.name} — CV`}
      subject="Resume"
      keywords={atsSkillKeywords.join(", ")}
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.role}>{profile.title}</Text>
        <View style={s.contactRow}>
          <Text style={s.contactItem}>{profile.contact.email}</Text>
          <Text style={s.contactItem}>{profile.contact.phone}</Text>
          <Text style={s.contactItem}>{profile.location}</Text>
          <Link style={[s.contactItem, s.link]} src={profile.contact.github}>
            github.com/{profile.contact.githubHandle}
          </Link>
          <Link style={[s.contactItem, s.link]} src={profile.contact.leetcode}>
            leetcode.com/{profile.contact.leetcodeHandle}
          </Link>
        </View>

        {/* Summary */}
        <Text style={s.sectionTitle}>Professional Summary</Text>
        <Text style={s.summary}>{profile.summary}</Text>

        {/* Experience */}
        <Text style={s.sectionTitle}>Experience</Text>
        {experiences.map((e) => (
          <View key={e.company} wrap={false}>
            <View style={s.jobHead}>
              <Text style={s.jobTitle}>
                {e.role} — <Text style={s.jobCompany}>{e.company}</Text>
              </Text>
              <Text style={s.jobMeta}>
                {e.start} – {e.end}  |  {e.location}
              </Text>
            </View>
            {e.highlights.map((h, i) => (
              <Bullet key={i}>{h}</Bullet>
            ))}
          </View>
        ))}

        {/* Projects */}
        <Text style={s.sectionTitle}>Key Projects</Text>
        {featured.map((p) => (
          <View key={p.name} style={s.projRow} wrap={false}>
            <View style={s.twoColWrap}>
              <Text style={s.projName}>
                {p.name}
                {p.links[0] ? "" : ""}
              </Text>
              <Link style={[s.projTech, s.link]} src={p.links[0]?.url || profile.contact.github}>
                {p.links[0]?.url.replace("https://", "") || ""}
              </Link>
            </View>
            <Text style={s.projTech}>{p.stack.slice(0, 8).join(" · ")}</Text>
            <Text style={s.projDesc}>{p.bullets[0]}</Text>
          </View>
        ))}

        {/* Skills */}
        <Text style={s.sectionTitle}>Technical Skills</Text>
        {skillGroups.map((g) => (
          <Text key={g.category} style={s.skillLine}>
            <Text style={s.skillCat}>{g.category}: </Text>
            {g.skills.map((sk) => sk.name).join(", ")}
          </Text>
        ))}

        {/* Education + Achievements side by side to save vertical space */}
        <Text style={s.sectionTitle}>Education</Text>
        {education.map((ed) => (
          <View key={ed.school}>
            <View style={s.eduHead}>
              <Text style={s.jobTitle}>{ed.degree}</Text>
              <Text style={s.jobMeta}>
                {ed.start} – {ed.end}
              </Text>
            </View>
            <Text style={s.projTech}>
              {ed.school}, {ed.location} — {ed.note}
            </Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>Achievements</Text>
        {achievements.map((a) => (
          <View key={a.title} style={s.bulletRow}>
            <Text style={s.bulletDot}>▪</Text>
            <Text style={s.bulletText}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{a.title}. </Text>
              {a.detail}
            </Text>
          </View>
        ))}
        <Text style={{ fontSize: 8, color: SUB, marginTop: 4 }}>
          LeetCode: {leetcode.total} solved ({leetcode.medium} Medium, {leetcode.hard} Hard).
        </Text>
      </Page>
    </Document>
  );
}

export async function generateCvBlob(): Promise<Blob> {
  return pdf(<CvDoc />).toBlob();
}
