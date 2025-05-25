package es.jose.backend.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpNumberGenerator {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_MAX = 999999;

    public String generateOtp(Integer length) {

        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }

        var secureRandom = new SecureRandom();
        int code = secureRandom.nextInt(OTP_MAX + 1);

        return String.format("%0" + length + "d", code);
    }

    public String generateOtp() {
        return generateOtp(OTP_LENGTH);
    }
}
