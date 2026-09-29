import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { formatContact, type CvBullet, type TailoredCv } from "@/lib/cv-types"

// Sin esto react-pdf parte palabras con guion al final de línea
Font.registerHyphenationCallback((word) => [word])

const styles = StyleSheet.create({
  page: {
    paddingVertical: 42,
    paddingHorizontal: 50,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    lineHeight: 1.3,
    color: "#000",
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 16,
    textAlign: "center",
  },
  contact: { marginTop: 3, fontSize: 10, textAlign: "center" },
  section: { marginTop: 11 },
  heading: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingBottom: 1.5,
    marginBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: "#000",
  },
  entry: { marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontFamily: "Times-Italic" },
  bullet: { flexDirection: "row", marginTop: 1.5, paddingLeft: 8 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1, textAlign: "justify" },
  paragraph: { textAlign: "justify" },
})

function Entry({
  title,
  place,
  subtitle,
  dates,
  bullets,
}: {
  title: string
  place?: string
  subtitle?: string
  dates?: string
  bullets: string[]
}) {
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.row}>
        <Text style={styles.bold}>{title}</Text>
        {place ? <Text>{place}</Text> : null}
      </View>
      {subtitle || dates ? (
        <View style={styles.row}>
          <Text style={styles.italic}>{subtitle}</Text>
          <Text style={styles.italic}>{dates}</Text>
        </View>
      ) : null}
      {bullets.map((text, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{text}</Text>
        </View>
      ))}
    </View>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {children}
    </View>
  )
}

const texts = (bullets: CvBullet[]) =>
  bullets.map((b) => b.text.trim()).filter(Boolean)

export function HarvardCvDocument({ cv }: { cv: TailoredCv }) {
  const skills = [
    ...cv.skills,
    ...(cv.languages ? [{ category: "Idiomas", items: cv.languages }] : []),
  ]

  return (
    <Document title={`CV — ${cv.name}`} author={cv.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cv.name}</Text>
        <Text style={styles.contact}>{formatContact(cv.contact)}</Text>

        {cv.summary.text.trim() ? (
          <Section title="Perfil">
            <Text style={styles.paragraph}>{cv.summary.text.trim()}</Text>
          </Section>
        ) : null}

        {cv.education.length > 0 ? (
          <Section title="Educación">
            {cv.education.map((e, i) => (
              <Entry
                key={i}
                title={e.institution}
                place={e.location}
                subtitle={e.degree}
                dates={e.dates}
                bullets={e.details}
              />
            ))}
          </Section>
        ) : null}

        {cv.experience.length > 0 ? (
          <Section title="Experiencia">
            {cv.experience.map((e, i) => (
              <Entry
                key={i}
                title={e.organization}
                place={e.location}
                subtitle={e.role}
                dates={e.dates}
                bullets={texts(e.bullets)}
              />
            ))}
          </Section>
        ) : null}

        {cv.projects.length > 0 ? (
          <Section title="Proyectos">
            {cv.projects.map((p, i) => (
              <Entry
                key={i}
                title={p.name}
                place={p.dates}
                bullets={texts(p.bullets)}
              />
            ))}
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section title="Habilidades">
            {skills.map((s, i) => (
              <Text key={i} style={{ marginTop: i ? 1.5 : 0 }}>
                <Text style={styles.bold}>{s.category}: </Text>
                {s.items}
              </Text>
            ))}
          </Section>
        ) : null}
      </Page>
    </Document>
  )
}
