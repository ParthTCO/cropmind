import { Cloud, Droplets, Thermometer, Wind, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherWidgetProps {
  temperature?: number;
  feelsLike?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  rainChance?: number;
  rainAmount?: string;
  alert?: string;
  loading?: boolean;
}

function getWeatherEmoji(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("rain")) return "🌧️";
  if (lower.includes("cloud")) return "🌤️";
  if (lower.includes("clear") || lower.includes("sunny")) return "☀️";
  return "🌤️";
}

export function WeatherWidget({
  temperature = 28,
  feelsLike = 30,
  condition = "Partly Cloudy",
  humidity = 65,
  windSpeed = 12,
  rainChance = 0,
  rainAmount,
  alert,
  loading = false
}: WeatherWidgetProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Weather Forecast
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          {loading ? (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          ) : (
            <Cloud className="h-4 w-4 text-blue-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
              <div className="h-12 w-12 bg-muted rounded"></div>
            </div>
            <div className="h-px bg-muted"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{Math.round(temperature)}°C</div>
                <p className="text-sm text-muted-foreground">{condition}</p>
              </div>
              <div className="text-6xl opacity-80">{getWeatherEmoji(condition)}</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
              <div className="flex flex-col items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Humidity</span>
                <span className="text-sm font-medium">{humidity}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Wind</span>
                <span className="text-sm font-medium">{Math.round(windSpeed)} km/h</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Feels</span>
                <span className="text-sm font-medium">{Math.round(feelsLike)}°C</span>
              </div>
            </div>

            {(alert || rainChance > 50) && (
              <div className="mt-4 rounded-lg bg-amber-500/10 p-3">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {alert || "Rain Expected"}
                </p>
                {rainAmount && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {rainChance}% chance of rainfall, {rainAmount} expected
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

