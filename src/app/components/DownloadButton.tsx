"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";
import { PdfActivity, TripPDF } from "./pdf/trip-pdf";

export interface TripData {
  destination: string;
  days: number;
  pace: string;
  itinerary: {
    theme: string;
    activities: PdfActivity[];
  }[];
}

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="outline" className="gap-2">
        <Download className="w-4 h-4" />
        Carregando PDF...
      </Button>
    ),
  },
);

export function DownloadButton({ trip }: { trip: TripData }) {
  return (
    <PDFDownloadLink
      document={<TripPDF trip={trip} />}
      fileName={`roteiro-${trip.destination.toLowerCase()}.pdf`}
    >
      {({ loading }) => (
        <Button
          disabled={loading}
          variant="outline"
          className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          <Download className="w-4 h-4" />
          {loading ? "Gerando..." : "Baixar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
