package uts.sdk.modules.gioUniappxAutotracker
import java.nio.charset.StandardCharsets

object NativeHelper {
    fun utf8ByteLength(str: String): Int {
        return str.toByteArray(StandardCharsets.UTF_8).size
    }
}