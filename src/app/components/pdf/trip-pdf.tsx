import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

interface ItineraryDay {
  theme: string;
  activities: string[];
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
  section: { margin: 10, padding: 10 },
  dayContainer: { marginBottom: 15 },
  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#fdf8f3",
    padding: 5,
  },
  activity: { fontSize: 10, marginBottom: 3, marginLeft: 10 },
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
                  <Text key={i} style={styles.activity}>
                    • {activity}
                  </Text>
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
