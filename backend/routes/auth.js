const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const firebaseAdmin = require('../config/firebase');

const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

// ==========================================
// TEMPORARY STORES
// ==========================================

const otpStore = {};
const passkeyChallenges = {};

// ==========================================
// WEBAUTHN CONFIG
// ==========================================

const rpName = 'National Scheme Portal';
const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.ORIGIN || 'http://localhost:3000';

// Ensure passkeys table exists
db.query(`
    CREATE TABLE IF NOT EXISTS passkeys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        credential_id VARCHAR(500) NOT NULL,
        public_key TEXT NOT NULL,
        counter BIGINT DEFAULT 0,
        device_type VARCHAR(100) DEFAULT 'singleDevice',
        backed_up TINYINT(1) DEFAULT 0,
        transports VARCHAR(255) DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.warn('[Passkey] passkeys table check:', err.message);
});

// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ==========================================
// DATABASE PROMISE HELPER
// ==========================================

const queryDb = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication required!'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        console.error('JWT Error:', error.message);

        return res.status(401).json({
            message: 'Invalid or expired token!'
        });
    }
};

// ==========================================
// USER RESPONSE HELPER
// ==========================================

const formatUser = (user) => {
    if (!user) return null;

    return {
        id: user.id,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        religion: user.religion || '',
        caste: user.caste || '',
        state: user.state || '',
        district: user.district || '',
        taluka: user.taluka || '',
        village_city: user.village_city || '',
        pin_code: user.pin_code || '',
        house_type: user.house_type || '',
        family_members: user.family_members || '',
        number_of_children: user.number_of_children || '',
        yearly_income: user.yearly_income || '',
        occupation: user.occupation || '',
        education: user.education || '',
        photo: user.photo || ''
    };
};

// ==========================================
// 1. REGISTER
// ==========================================

router.post('/register', async (req, res) => {
    try {

        const {
            full_name,
            phone,
            email,
            password,
            age,
            gender,
            religion,
            caste,
            state,
            district,
            taluka,
            village_city,
            pin_code,
            house_type,
            family_members,
            number_of_children,
            yearly_income,
            occupation,
            education
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: 'Full name, email and password are required!'
            });
        }

        const existingUsers = await queryDb(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [email, phone || '']
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'User already exists!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (
                full_name,
                phone,
                email,
                password,
                age,
                gender,
                religion,
                caste,
                state,
                district,
                taluka,
                village_city,
                pin_code,
                house_type,
                family_members,
                number_of_children,
                yearly_income,
                occupation,
                education
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            full_name,
            phone || null,
            email,
            hashedPassword,
            age || null,
            gender || null,
            religion || null,
            caste || null,
            state || null,
            district || null,
            taluka || null,
            village_city || null,
            pin_code || null,
            house_type || null,
            family_members || null,
            number_of_children || null,
            yearly_income || null,
            occupation || null,
            education || null
        ];

        const result = await queryDb(sql, values);

        // Welcome Email
        try {

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to Government Scheme Portal 🎉',
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

                        <div style="
                            background:linear-gradient(135deg,#1a237e,#1565c0);
                            padding:30px;
                            text-align:center;
                            border-radius:10px 10px 0 0;
                        ">
                            <h1 style="color:white;">
                                🏛️ Government Scheme Portal
                            </h1>
                        </div>

                        <div style="padding:30px;background:#f5f5f5;">

                            <h2 style="color:#1a237e;">
                                Welcome, ${full_name}! 🎉
                            </h2>

                            <p>
                                Your account has been created successfully.
                            </p>

                            <p>
                                You can now discover government schemes
                                that match your profile.
                            </p>

                            <div style="text-align:center;margin:25px 0;">

                                <a
                                    href="http://localhost:3000/login"
                                    style="
                                        background:#ff6f00;
                                        color:white;
                                        padding:12px 30px;
                                        text-decoration:none;
                                        border-radius:8px;
                                        font-weight:bold;
                                    "
                                >
                                    Login Now
                                </a>

                            </div>

                        </div>

                    </div>
                `
            });

        } catch (emailError) {
            console.log('Welcome email error:', emailError.message);
        }

        return res.status(201).json({
            message: 'User registered successfully!',
            userId: result.insertId
        });

    } catch (error) {

        console.error('Registration Error:', error);

        return res.status(500).json({
            message: 'Registration failed!',
            error: error.message
        });
    }
});

// ==========================================
// 2. LOGIN
// ==========================================

router.post('/login', async (req, res) => {

    try {

        const {
            email,
            phone,
            password
        } = req.body;

        if (!password) {
            return res.status(400).json({
                message: 'Password is required!'
            });
        }

        const identifier = email || phone;

        if (!identifier) {
            return res.status(400).json({
                message: 'Email or phone is required!'
            });
        }

        const field = email ? 'email' : 'phone';

        const results = await queryDb(
            `SELECT * FROM users WHERE ${field} = ?`,
            [identifier]
        );

        if (results.length === 0) {
            return res.status(400).json({
                message: 'User not found!'
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Wrong password!'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return res.json({
            message: 'Login successful!',
            token,
            user: formatUser(user)
        });

    } catch (error) {

        console.error('Login Error:', error);

        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// ==========================================
// 3. GET CURRENT USER PROFILE
// ==========================================

router.get('/profile', authenticateToken, async (req, res) => {

    try {

        const results = await queryDb(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        return res.json({
            message: 'Profile fetched successfully!',
            user: formatUser(results[0])
        });

    } catch (error) {

        console.error('Profile Fetch Error:', error);

        return res.status(500).json({
            message: 'Failed to fetch profile!'
        });
    }
});

// ==========================================
// 4. UPDATE PROFILE
// ==========================================

router.put('/update/:id', authenticateToken, async (req, res) => {

    try {

        const requestedId = Number(req.params.id);
        const loggedInUserId = Number(req.user.id);

        // IMPORTANT:
        // User can update ONLY their own profile.
        if (requestedId !== loggedInUserId) {
            return res.status(403).json({
                message: 'You are not authorized to update this profile!'
            });
        }

        const {
            full_name,
            phone,
            age,
            gender,
            religion,
            caste,
            state,
            district,
            taluka,
            village_city,
            pin_code,
            house_type,
            family_members,
            number_of_children,
            yearly_income,
            occupation,
            education
        } = req.body;

        // Phone validation
        if (phone && !/^[0-9]{10}$/.test(String(phone))) {
            return res.status(400).json({
                message: 'Phone number must be 10 digits!'
            });
        }

        // Check duplicate phone
        if (phone) {

            const existingPhone = await queryDb(
                'SELECT id FROM users WHERE phone = ? AND id != ?',
                [phone, requestedId]
            );

            if (existingPhone.length > 0) {
                return res.status(400).json({
                    message: 'This phone number is already registered!'
                });
            }
        }

        const sql = `
            UPDATE users SET
                full_name = ?,
                phone = ?,
                age = ?,
                gender = ?,
                religion = ?,
                caste = ?,
                state = ?,
                district = ?,
                taluka = ?,
                village_city = ?,
                pin_code = ?,
                house_type = ?,
                family_members = ?,
                number_of_children = ?,
                yearly_income = ?,
                occupation = ?,
                education = ?
            WHERE id = ?
        `;

        const values = [
            full_name || null,
            phone || null,
            age || null,
            gender || null,
            religion || null,
            caste || null,
            state || null,
            district || null,
            taluka || null,
            village_city || null,
            pin_code || null,
            house_type || null,
            family_members || null,
            number_of_children || null,
            yearly_income || null,
            occupation || null,
            education || null,
            requestedId
        ];

        const result = await queryDb(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        const updatedUsers = await queryDb(
            'SELECT * FROM users WHERE id = ?',
            [requestedId]
        );

        if (updatedUsers.length === 0) {
            return res.status(404).json({
                message: 'User not found after update!'
            });
        }

        return res.json({
            message: 'Profile updated successfully!',
            user: formatUser(updatedUsers[0])
        });

    } catch (error) {

        console.error('Profile Update Error:', error);

        return res.status(500).json({
            message: 'Update failed!',
            error: error.message
        });
    }
});

// ==========================================
// 5. CHANGE PASSWORD
// ==========================================

router.put('/change-password/:id', authenticateToken, async (req, res) => {

    try {

        const requestedId = Number(req.params.id);
        const loggedInUserId = Number(req.user.id);

        if (requestedId !== loggedInUserId) {
            return res.status(403).json({
                message: 'You are not authorized to change this password!'
            });
        }

        const current_password = req.body.current_password || req.body.currentPassword;
        const new_password = req.body.new_password || req.body.newPassword;

        if (!current_password || !new_password) {
            return res.status(400).json({
                message: 'Current and new password are required!'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters!'
            });
        }

        const results = await queryDb(
            'SELECT * FROM users WHERE id = ?',
            [requestedId]
        );

        if (results.length === 0) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            current_password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect!'
            });
        }

        const hashedPassword = await bcrypt.hash(
            new_password,
            10
        );

        await queryDb(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, requestedId]
        );

        return res.json({
            message: 'Password changed successfully!'
        });

    } catch (error) {

        console.error('Change Password Error:', error);

        return res.status(500).json({
            message: 'Failed to change password!'
        });
    }
});

// ==========================================
// 6. SEND EMAIL OTP
// ==========================================

router.post('/send-email-otp', async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required!'
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        };

        console.log('OTP generated for:', email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for Government Scheme Portal',
            html: `
                <div style="font-family:Arial;padding:20px;">

                    <h2>🏛️ Government Scheme Portal</h2>

                    <p>Your verification OTP is:</p>

                    <h1 style="
                        color:#1a237e;
                        font-size:36px;
                        letter-spacing:8px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for 10 minutes.
                    </p>

                    <p>
                        Do not share this OTP with anyone.
                    </p>

                </div>
            `
        });

        return res.json({
            message: 'OTP sent to your email!'
        });

    } catch (error) {

        console.error('Email OTP Error:', error);

        return res.status(500).json({
            message: 'Failed to send OTP!'
        });
    }
});

// ==========================================
// 7. VERIFY EMAIL OTP
// ==========================================

router.post('/verify-email-otp', async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;

        const stored = otpStore[email];

        if (!stored) {
            return res.status(400).json({
                message: 'OTP expired! Please request again.'
            });
        }

        if (Date.now() > stored.expiresAt) {

            delete otpStore[email];

            return res.status(400).json({
                message: 'OTP expired! Please request again.'
            });
        }

        if (stored.otp !== String(otp)) {
            return res.status(400).json({
                message: 'Invalid OTP!'
            });
        }

        delete otpStore[email];

        return res.json({
            message: 'OTP verified successfully!'
        });

    } catch (error) {

        return res.status(500).json({
            message: 'Server error'
        });
    }
});

// ==========================================
// 8. FORGOT PASSWORD - SEND OTP
// ==========================================

router.post('/forgot-password/send-otp', async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required!'
            });
        }

        const results = await queryDb(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (results.length === 0) {
            return res.status(404).json({
                message: 'No account found with this email!'
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        otpStore[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP - Government Scheme Portal',
            html: `
                <div style="font-family:Arial;padding:20px;">

                    <h2>🏛️ Government Scheme Portal</h2>

                    <p>Your password reset OTP is:</p>

                    <h1 style="
                        color:#1a237e;
                        font-size:36px;
                        letter-spacing:8px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP is valid for 10 minutes.
                    </p>

                    <p>
                        If you did not request this, ignore this email.
                    </p>

                </div>
            `
        });

        return res.json({
            message: 'OTP sent to your email!'
        });

    } catch (error) {

        console.error('Forgot Password OTP Error:', error);

        return res.status(500).json({
            message: 'Failed to send OTP!'
        });
    }
});

// ==========================================
// 9. FORGOT PASSWORD - RESET
// ==========================================

router.post('/forgot-password/reset', async (req, res) => {

    try {

        const {
            email,
            otp,
            new_password
        } = req.body;

        if (!email || !otp || !new_password) {
            return res.status(400).json({
                message: 'Email, OTP and new password are required!'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters!'
            });
        }

        const stored = otpStore[email];

        if (!stored) {
            return res.status(400).json({
                message: 'OTP expired! Please request again.'
            });
        }

        if (Date.now() > stored.expiresAt) {

            delete otpStore[email];

            return res.status(400).json({
                message: 'OTP expired! Please request again.'
            });
        }

        if (stored.otp !== String(otp)) {
            return res.status(400).json({
                message: 'Invalid OTP!'
            });
        }

        const hashedPassword = await bcrypt.hash(
            new_password,
            10
        );

        const result = await queryDb(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        delete otpStore[email];

        return res.json({
            message: 'Password reset successfully! Please login.'
        });

    } catch (error) {

        console.error('Reset Password Error:', error);

        return res.status(500).json({
            message: 'Failed to reset password!'
        });
    }
});

// ==========================================
// 10. FIREBASE OAUTH HANDLER (GOOGLE & MICROSOFT)
// ==========================================

const handleFirebaseOAuthLogin = async (body, defaultFallbackName, providerPasswordTag, providerDisplayName, res) => {
    let email = null;
    let full_name = null;
    let photo = null;

    const { idToken } = body || {};

    // 1. Attempt Firebase Admin ID token cryptographic verification
    if (idToken) {
        try {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
            email = decodedToken.email;
            full_name = decodedToken.name;
            photo = decodedToken.picture;
        } catch (verifyErr) {
            console.warn(`[${providerDisplayName} Login] verifyIdToken check:`, verifyErr.message);
        }
    }

    // 2. Fallback to client payload fields if token didn't provide email
    if (!email && body) {
        email = body.email;
        full_name = body.full_name || full_name;
        photo = body.photo || photo;
    }

    if (!email) {
        return res.status(400).json({
            message: `${providerDisplayName} email is required!`
        });
    }

    full_name = full_name || defaultFallbackName;
    photo = photo || '';

    const results = await queryDb(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    let user;

    if (results.length === 0) {
        const result = await queryDb(
            `
            INSERT INTO users
            (full_name, email, password)
            VALUES (?, ?, ?)
            `,
            [
                full_name,
                email,
                providerPasswordTag
            ]
        );

        user = {
            id: result.insertId,
            full_name,
            email,
            photo
        };
    } else {
        user = results[0];
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );

    return res.json({
        message: `${providerDisplayName} login successful!`,
        token,
        user: formatUser({
            ...user,
            photo: photo || user.photo || ''
        })
    });
};

// ==========================================
// 10.1 GOOGLE LOGIN
// ==========================================

router.post('/google-login', async (req, res) => {
    try {
        return await handleFirebaseOAuthLogin(
            req.body,
            'Google User',
            'GOOGLE_LOGIN',
            'Google',
            res
        );
    } catch (error) {
        console.error('Google Login Error:', error);
        return res.status(500).json({
            message: 'Google Login Failed!',
            error: error.message
        });
    }
});

// ==========================================
// 10.2 MICROSOFT LOGIN
// ==========================================

router.post('/microsoft-login', async (req, res) => {
    try {
        return await handleFirebaseOAuthLogin(
            req.body,
            'Microsoft User',
            'MICROSOFT_LOGIN',
            'Microsoft',
            res
        );
    } catch (error) {
        console.error('Microsoft Login Error:', error);
        return res.status(500).json({
            message: 'Microsoft Login Failed!',
            error: error.message
        });
    }
});

// ==========================================
// 11. PASSKEY REGISTER OPTIONS
// ==========================================

router.post('/passkey/register/options', async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const users = await queryDb(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const userPasskeys = await queryDb(
            'SELECT credential_id FROM passkeys WHERE user_id = ?',
            [user.id]
        );

        const excludeCredentials = userPasskeys.map(pk => ({
            id: pk.credential_id,
            type: 'public-key'
        }));

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: Buffer.from(String(user.id)),
            userName: user.email,
            attestationType: 'none',
            excludeCredentials,
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred'
            }
        });

        passkeyChallenges[email] = options.challenge;

        return res.json(options);

    } catch (error) {

        console.error(
            'Passkey Register Options Error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to generate passkey options',
            error: error.message
        });
    }
});

// ==========================================
// 12. PASSKEY REGISTER VERIFY
// ==========================================

router.post('/passkey/register/verify', async (req, res) => {

    try {

        const email = req.body.email;
        const registrationResponse = req.body.registrationResponse || req.body.regResponse || req.body.response;

        if (!email || !registrationResponse) {
            return res.status(400).json({
                message: 'Email and registration data are required'
            });
        }

        const expectedChallenge = passkeyChallenges[email];

        if (!expectedChallenge) {
            return res.status(400).json({
                message: 'Passkey challenge expired or invalid'
            });
        }

        const users = await queryDb(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const verification = await verifyRegistrationResponse({
            response: registrationResponse,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID
        });

        const {
            verified,
            registrationInfo
        } = verification;

        if (!verified || !registrationInfo) {

            return res.status(400).json({
                verified: false,
                message: 'Passkey registration verification failed'
            });
        }

        const {
            credential,
            credentialDeviceType,
            credentialBackedUp
        } = registrationInfo;

        const credentialID = credential.id;

        const publicKeyBase64 =
            Buffer.from(credential.publicKey).toString('base64');

        const counter = credential.counter;

        const transports =
            credential.transports
                ? JSON.stringify(credential.transports)
                : '[]';

        await queryDb(
            `
            INSERT INTO passkeys
            (
                user_id,
                credential_id,
                public_key,
                counter,
                device_type,
                backed_up,
                transports
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user.id,
                credentialID,
                publicKeyBase64,
                counter,
                credentialDeviceType,
                credentialBackedUp ? 1 : 0,
                transports
            ]
        );

        delete passkeyChallenges[email];

        return res.json({
            verified: true,
            message: 'Passkey registered successfully!'
        });

    } catch (error) {

        console.error(
            'Passkey Register Verify Error:',
            error
        );

        delete passkeyChallenges[req.body.email];

        return res.status(500).json({
            message: 'Server error verifying passkey',
            error: error.message
        });
    }
});

// ==========================================
// 13. PASSKEY LOGIN OPTIONS
// ==========================================

router.post('/passkey/login/options', async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const users = await queryDb(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const userPasskeys = await queryDb(
            'SELECT credential_id, transports FROM passkeys WHERE user_id = ?',
            [user.id]
        );

        if (userPasskeys.length === 0) {
            return res.status(400).json({
                message: 'No passkeys registered for this account!'
            });
        }

        const allowCredentials = userPasskeys.map(pk => ({
            id: pk.credential_id,
            type: 'public-key',
            transports: pk.transports
                ? JSON.parse(pk.transports)
                : []
        }));

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials,
            userVerification: 'preferred'
        });

        passkeyChallenges[email] = options.challenge;

        return res.json(options);

    } catch (error) {

        console.error(
            'Passkey Login Options Error:',
            error
        );

        return res.status(500).json({
            message: 'Failed to generate passkey login options',
            error: error.message
        });
    }
});

// ==========================================
// 14. PASSKEY LOGIN VERIFY
// ==========================================

router.post('/passkey/login/verify', async (req, res) => {

    try {

        const email = req.body.email;
        const authResponse = req.body.authResponse || req.body.authenticationResponse || req.body.response;

        if (!email || !authResponse) {
            return res.status(400).json({
                message: 'Email and auth payload are required'
            });
        }

        const expectedChallenge = passkeyChallenges[email];

        if (!expectedChallenge) {
            return res.status(400).json({
                message: 'Passkey challenge expired or invalid'
            });
        }

        const users = await queryDb(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const passkeyResults = await queryDb(
            `
            SELECT *
            FROM passkeys
            WHERE credential_id = ?
            AND user_id = ?
            `,
            [
                authResponse.id,
                user.id
            ]
        );

        if (passkeyResults.length === 0) {
            return res.status(400).json({
                message: 'Passkey not registered with this user'
            });
        }

        const dbPasskey = passkeyResults[0];

        const verification = await verifyAuthenticationResponse({
            response: authResponse,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            credential: {
                id: dbPasskey.credential_id,
                publicKey: Buffer.from(
                    dbPasskey.public_key,
                    'base64'
                ),
                counter: dbPasskey.counter
            }
        });

        const {
            verified,
            authenticationInfo
        } = verification;

        if (!verified) {

            delete passkeyChallenges[email];

            return res.status(400).json({
                verified: false,
                message: 'Passkey login failed'
            });
        }

        await queryDb(
            'UPDATE passkeys SET counter = ? WHERE id = ?',
            [
                authenticationInfo.newCounter,
                dbPasskey.id
            ]
        );

        delete passkeyChallenges[email];

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return res.json({
            message: 'Passkey login successful!',
            token,
            user: formatUser(user)
        });

    } catch (error) {

        console.error(
            'Passkey Login Verify Error:',
            error
        );

        delete passkeyChallenges[req.body.email];

        return res.status(500).json({
            message: 'Server error verifying passkey login',
            error: error.message
        });
    }
});

// ==========================================
// EXPORT
// ==========================================

module.exports = router;