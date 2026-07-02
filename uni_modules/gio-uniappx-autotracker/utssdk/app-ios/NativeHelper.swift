import Foundation

// 参考https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin-hybrid.html#ios%E5%B9%B3%E5%8F%B0
// 通过原生混编补齐uni api相关功能
public class NativeHelper {
    
    static func getTimeZoneOffset() -> Int {
        return -(TimeZone.current.secondsFromGMT() / 60)
    }

    static func utf8ByteLength(_ str: String) -> Int {
        return str.utf8.count
    }
}