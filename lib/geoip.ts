export async function getGeoLocation(req: Request) {
  try {
    // 1. Extract client real IP from headers or fallback
    const rawIp = 
      req.headers.get("x-forwarded-for") || 
      req.headers.get("x-real-ip") || 
      req.headers.get("cf-connecting-ip") || 
      "82.132.232.11"; // Default fallback IP for local testing

    const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : "82.132.232.11";

    // Default object values
    let geoData = {
      ip: clientIp,
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      isp: "Unknown ISP",
      timezone: "Europe/London",
      proxyOrVpn: false,
    };

    // 2. Fetch IP intelligence data (using ipapi.co or ip-api.com)
    if (clientIp && clientIp !== "127.0.0.1" && clientIp !== "localhost" && !clientIp.startsWith("192.168.")) {
      try {
        const response = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,regionName,city,isp,timezone,mobile,proxy,query`, {
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          const json = await response.json();
          if (json.status === "success") {
            geoData = {
              ip: json.query || clientIp,
              country: json.country || "United Kingdom",
              countryCode: json.countryCode || "GB",
              region: json.regionName || "England",
              city: json.city || "London",
              isp: json.isp || "Unknown ISP",
              timezone: json.timezone || "Europe/London",
              proxyOrVpn: json.proxy || false,
            };
          }
        }
      } catch (err) {
        console.log("IP API lookup fallback triggered:", err);
      }
    }

    // 3. Extract User-Agent & Device info
    const userAgent = req.headers.get("user-agent") || "Desktop Browser";
    let deviceType = "Desktop / PC";
    if (/mobile/i.test(userAgent)) deviceType = "Mobile Smartphone";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "Tablet";

    return {
      ...geoData,
      deviceInfo: `${deviceType} | ${userAgent.slice(0, 65)}...`,
      formattedLocation: `${geoData.city}, ${geoData.region}, ${geoData.country} (${geoData.countryCode})`,
    };
  } catch (error) {
    console.error("GeoIP Error:", error);
    return {
      ip: "82.132.232.11",
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      isp: "Standard ISP",
      timezone: "Europe/London",
      proxyOrVpn: false,
      deviceInfo: "Secure Browser",
      formattedLocation: "London, England, United Kingdom (GB)",
    };
  }
}