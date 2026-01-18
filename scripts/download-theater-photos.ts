import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Configuration
const CONFIG = {
  SUPABASE_URL: "https://ovadwsnbmvrarouzwmam.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92YWR3c25ibXZyYXJvdXp3bWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDQ5NDIsImV4cCI6MjA4MzI4MDk0Mn0.06PTKla2C6rCxsxGTQ9TUAet1k43mLMnuWwZvX8bToQ",
  GOOGLE_PLACES_API_KEY: "AIzaSyCTaPHQW1GukdcJVwoakHEzysR-uXp-qQY",
  PHOTOS_DIR: "./theater-photos",
  MAX_PHOTOS_PER_THEATER: 3,
  PHOTO_MAX_WIDTH: 1920,
  // Rate limiting
  DELAY_BETWEEN_THEATERS_MS: 500,
  DELAY_BETWEEN_PHOTOS_MS: 200,
};

// Types
interface Theater {
  slug: string;
  name: string;
  city: string;
  state: string;
}

interface PlaceSearchResult {
  places?: Array<{
    id: string;
    displayName?: { text: string };
    photos?: Array<{ name: string }>;
  }>;
}

interface DownloadResult {
  slug: string;
  name: string;
  city: string;
  state: string;
  status: "success" | "no_place_found" | "no_photos" | "error";
  photosDownloaded: number;
  placeId?: string;
  placeName?: string;
  error?: string;
}

// Initialize Supabase client
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Helper: delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: ensure directory exists
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Search for a place using Google Places API (New)
async function searchPlace(
  theater: Theater
): Promise<{ placeId: string; placeName: string; photoNames: string[] } | null> {
  const searchQuery = `${theater.name} ${theater.city} ${theater.state}`;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": CONFIG.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Places API error: ${response.status} - ${errorText}`);
  }

  const data: PlaceSearchResult = await response.json();

  if (!data.places || data.places.length === 0) {
    return null;
  }

  const place = data.places[0];
  const photoNames = place.photos?.map((p) => p.name) || [];

  return {
    placeId: place.id,
    placeName: place.displayName?.text || theater.name,
    photoNames: photoNames.slice(0, CONFIG.MAX_PHOTOS_PER_THEATER),
  };
}

// Download a single photo
async function downloadPhoto(
  photoName: string,
  outputPath: string
): Promise<boolean> {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${CONFIG.PHOTO_MAX_WIDTH}&key=${CONFIG.GOOGLE_PLACES_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`  Failed to download photo: ${response.status}`);
    return false;
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  return true;
}

// Process a single theater
async function processTheater(theater: Theater): Promise<DownloadResult> {
  const result: DownloadResult = {
    slug: theater.slug,
    name: theater.name,
    city: theater.city,
    state: theater.state,
    status: "success",
    photosDownloaded: 0,
  };

  try {
    // Search for the place
    const placeResult = await searchPlace(theater);

    if (!placeResult) {
      result.status = "no_place_found";
      return result;
    }

    result.placeId = placeResult.placeId;
    result.placeName = placeResult.placeName;

    if (placeResult.photoNames.length === 0) {
      result.status = "no_photos";
      return result;
    }

    // Create directory for this theater
    const theaterDir = path.join(CONFIG.PHOTOS_DIR, theater.slug);
    ensureDir(theaterDir);

    // Download photos
    for (let i = 0; i < placeResult.photoNames.length; i++) {
      const photoName = placeResult.photoNames[i];
      const outputPath = path.join(theaterDir, `${i + 1}.jpg`);

      const success = await downloadPhoto(photoName, outputPath);
      if (success) {
        result.photosDownloaded++;
      }

      if (i < placeResult.photoNames.length - 1) {
        await delay(CONFIG.DELAY_BETWEEN_PHOTOS_MS);
      }
    }

    if (result.photosDownloaded === 0) {
      result.status = "no_photos";
    }
  } catch (error) {
    result.status = "error";
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

// Generate report
function generateReport(results: DownloadResult[], durationMs: number): string {
  const success = results.filter((r) => r.status === "success");
  const noPlaceFound = results.filter((r) => r.status === "no_place_found");
  const noPhotos = results.filter((r) => r.status === "no_photos");
  const errors = results.filter((r) => r.status === "error");
  const totalPhotos = results.reduce((sum, r) => sum + r.photosDownloaded, 0);

  let report = `
================================================================================
                    THEATER PHOTO DOWNLOAD REPORT
================================================================================

SUMMARY
-------
Total theaters processed: ${results.length}
Duration: ${(durationMs / 1000).toFixed(1)} seconds

  ✓ Success (with photos):     ${success.length}
  ○ No place found:            ${noPlaceFound.length}
  ○ Place found, no photos:    ${noPhotos.length}
  ✗ Errors:                    ${errors.length}

Total photos downloaded: ${totalPhotos}

`;

  if (success.length > 0) {
    report += `
SUCCESSFUL DOWNLOADS
--------------------
`;
    for (const r of success) {
      report += `  ✓ ${r.name} (${r.city}, ${r.state}) - ${r.photosDownloaded} photos\n`;
      report += `    Folder: ${CONFIG.PHOTOS_DIR}/${r.slug}/\n`;
      if (r.placeName !== r.name) {
        report += `    Google Place: "${r.placeName}"\n`;
      }
    }
  }

  if (noPlaceFound.length > 0) {
    report += `
NO PLACE FOUND (${noPlaceFound.length})
------------------
`;
    for (const r of noPlaceFound) {
      report += `  ○ ${r.name} (${r.city}, ${r.state})\n`;
    }
  }

  if (noPhotos.length > 0) {
    report += `
NO PHOTOS AVAILABLE (${noPhotos.length})
---------------------
`;
    for (const r of noPhotos) {
      report += `  ○ ${r.name} (${r.city}, ${r.state})\n`;
      if (r.placeName) {
        report += `    Google Place: "${r.placeName}"\n`;
      }
    }
  }

  if (errors.length > 0) {
    report += `
ERRORS (${errors.length})
------
`;
    for (const r of errors) {
      report += `  ✗ ${r.name} (${r.city}, ${r.state})\n`;
      report += `    Error: ${r.error}\n`;
    }
  }

  report += `
================================================================================
`;

  return report;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const limit = args.includes("--limit")
    ? parseInt(args[args.indexOf("--limit") + 1], 10)
    : undefined;
  const dryRun = args.includes("--dry-run");

  console.log("\n🎬 Theater Photo Downloader\n");
  console.log(`Mode: ${dryRun ? "DRY RUN (no downloads)" : "LIVE"}`);
  if (limit) {
    console.log(`Limit: ${limit} theaters`);
  }
  console.log("");

  // Fetch theaters from Supabase
  console.log("Fetching theaters from Supabase...");
  let query = supabase
    .from("theaters")
    .select("slug, name, city, state")
    .order("slug");

  if (limit) {
    query = query.limit(limit);
  }

  const { data: theaters, error } = await query;

  if (error) {
    console.error("Failed to fetch theaters:", error.message);
    process.exit(1);
  }

  if (!theaters || theaters.length === 0) {
    console.log("No theaters found.");
    process.exit(0);
  }

  console.log(`Found ${theaters.length} theaters.\n`);

  if (dryRun) {
    console.log("DRY RUN - Would process these theaters:\n");
    for (const t of theaters) {
      console.log(`  - ${t.name} (${t.city}, ${t.state}) [${t.slug}]`);
    }
    console.log("\nRun without --dry-run to download photos.");
    return;
  }

  // Create photos directory
  ensureDir(CONFIG.PHOTOS_DIR);

  // Process theaters
  const results: DownloadResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < theaters.length; i++) {
    const theater = theaters[i];
    const progress = `[${i + 1}/${theaters.length}]`;

    console.log(`${progress} Processing: ${theater.name} (${theater.city}, ${theater.state})`);

    const result = await processTheater(theater);
    results.push(result);

    if (result.status === "success") {
      console.log(`  ✓ Downloaded ${result.photosDownloaded} photos`);
    } else if (result.status === "no_place_found") {
      console.log(`  ○ No place found on Google`);
    } else if (result.status === "no_photos") {
      console.log(`  ○ No photos available`);
    } else {
      console.log(`  ✗ Error: ${result.error}`);
    }

    // Rate limiting between theaters
    if (i < theaters.length - 1) {
      await delay(CONFIG.DELAY_BETWEEN_THEATERS_MS);
    }
  }

  const duration = Date.now() - startTime;

  // Generate and save report
  const report = generateReport(results, duration);
  console.log(report);

  const reportPath = path.join(
    CONFIG.PHOTOS_DIR,
    `report-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, "")}.txt`
  );
  fs.writeFileSync(reportPath, report);
  console.log(`Report saved to: ${reportPath}\n`);
}

// Run
main().catch(console.error);
