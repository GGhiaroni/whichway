import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export interface PdfActivity {
  time: string;
  title: string;
  description: string;
}

interface ItineraryDay {
  theme: string;
  activities: PdfActivity[];
}

interface TripPDFProps {
  trip: {
    destination: string;
    days: number;
    pace: string;
    itinerary: ItineraryDay[];
  };
}

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  title: { fontSize: 24, marginBottom: 5, color: "#e3592c" },
  subtitle: { fontSize: 12, color: "#666" },
  dayContainer: { marginBottom: 15 },
  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#fdf8f3",
    padding: 5,
  },

  activityContainer: {
    marginBottom: 8,
    marginLeft: 10,
    paddingLeft: 10,
    borderLeft: 1,
    borderLeftColor: "#ddd",
  },
  activityHeader: {
    flexDirection: "row",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#e3592c",
    marginRight: 5,
    textTransform: "uppercase",
  },
  activityTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  activityDesc: {
    fontSize: 9,
    color: "#555",
    marginTop: 2,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "grey",
  },
});

export const TripPDF = ({ trip }: TripPDFProps) => {
  const safeItinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Roteiro para {trip.destination}</Text>
          <Text style={styles.subtitle}>
            Gerado pelo WhichWay • {trip.days} dias • Estilo {trip.pace}
          </Text>
        </View>

        <View>
          {safeItinerary.length > 0 ? (
            safeItinerary.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.dayTitle}>
                  Dia {index + 1}: {day.theme || "Exploração"}
                </Text>

                {day.activities?.map((activity, i) => (
                  <View key={i} style={styles.activityContainer}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                    </View>

                    <Text style={styles.activityDesc}>
                      {activity.description}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text>Roteiro não formatado.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text>
            Este roteiro foi gerado por Inteligência Artificial no WhichWay.
            Verifique disponibilidades locais.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
