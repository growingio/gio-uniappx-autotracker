import Foundation

public class TimeZoneHelper {
    
    static func getTimeZoneOffset() -> Int {
        return -(TimeZone.current.secondsFromGMT() / 60)
    }
}