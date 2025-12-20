// Typy
type VisualDef = {
  value: string;
  delay: number;
  duration: number;
  chainWithPrevious: boolean;
};

// Struktura z obliczonymi czasami absolutnymi
type ProcessedVisual = VisualDef & {
  startTime: number;
  endTime: number;
};

const visuals: VisualDef[] = [
  { value: "1", delay: 0, duration: 1, chainWithPrevious: false }, // Start: 0s, Koniec: 1s
  { value: "2", delay: 0.2, duration: 1, chainWithPrevious: true }, // Start: 0.2s (względem startu poprzedniego), Koniec: 1.2s
  { value: "3", delay: 0, duration: 1, chainWithPrevious: false }, // Start: 1.2s (po najdłuższym z poprzedniej grupy), Koniec: 2.2s
];

// --- KROK 1: Pre-kalkulacja Timeline'u ---
// Obliczamy czasy raz, zamiast w każdej klatce pętli
const processedVisuals: ProcessedVisual[] = [];

let timelineCursor = 0; // Wskazuje koniec ostatniej sekwencji (kiedy ma się zacząć następny "nie-zchainowany" element)
let previousStartTime = 0; // Zapamiętuje start poprzedniego elementu dla chainWithPrevious

visuals.forEach((visual, index) => {
  let startTime: number;

  // Logika chainowania
  if (index > 0 && visual.chainWithPrevious) {
    // Jeśli chain: startujemy względem STARTU poprzedniego elementu
    startTime = previousStartTime + visual.delay;
  } else {
    // Jeśli nie chain: startujemy po ZAKOŃCZENIU dotychczasowej sekwencji
    startTime = timelineCursor + visual.delay;
  }

  const endTime = startTime + visual.duration;

  // Aktualizacja kursorów
  previousStartTime = startTime;

  // Przesuwamy kursor końca timeline'u tylko jeśli ten element kończy się później niż dotychczasowe
  // To pozwala grupie nakładających się animacji poprawnie opóźnić kolejną sekwencję
  if (endTime > timelineCursor) {
    timelineCursor = endTime;
  }

  processedVisuals.push({
    ...visual,
    startTime,
    endTime,
  });
});

// --- KROK 2: Pętla renderowania ---
const duration = 5; // Skróciłem dla czytelności outputu
const deltaTime = 0.1;

console.log("--- Rozpoczynam renderowanie ---");

for (let t = 0; t < duration; t += deltaTime) {
  // Optymalizacja wyświetlania czasu
  const currentTime = parseFloat(t.toFixed(1));
  const activeVisuals: string[] = [];

  // Teraz pętla jest bardzo szybka - proste porównanie liczb
  for (const visual of processedVisuals) {
    if (currentTime >= visual.startTime && currentTime < visual.endTime) {
      activeVisuals.push(visual.value);
    }
  }

  if (activeVisuals.length > 0) {
    console.log(`Time ${currentTime}s: Rendering [ ${activeVisuals.join(", ")} ]`);
  } else {
    // console.log(`Time ${currentTime}s: Idle`);
  }
}
