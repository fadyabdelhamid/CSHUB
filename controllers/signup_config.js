import Signup from "../models/signup_schema.js"
import bcrypt from 'bcrypt';




const signupform = async (req, res) => {
  try {
    const saltRounds = 10;
    const { signupName, signupEmail, signupPassword, signupConfirmPassword, Type } = req.body;

    let errors = {};
    if (!signupName) {
      errors.name = 'Name is required';
    }
    if (!signupEmail) {
      errors.email = 'Email is required';
    }
    if (!signupPassword) {
      errors.password = 'Password is required';
    } else {
      const passwordError = validatePasswordStrength(signupPassword);
      if (passwordError) {
        errors.password = passwordError;
      }
    }
    if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      return res.json({ success: false, errors });
    }

    const existingUser = await Signup.findOne({ mail: signupEmail });
    if (existingUser) {
      return res.json({ success: false, errors: { email: 'Email already exists' } });
    }

    const hashedPassword = await bcrypt.hash(signupPassword, saltRounds);
    const hashedcPassword = await bcrypt.hash(signupConfirmPassword, saltRounds);

    const sign = new Signup({
      fullname: signupName,
      mail: signupEmail,
      password: hashedPassword,
      cpassword: hashedcPassword,
      Type: Type,
    });

    await sign.save();
    res.json({ success: true, redirectUrl: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit.");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least one special character (@$!%*?&).");
  }
  return errors.length > 0 ? errors.join(" ") : null;
}
const exportsignup = {
  signupform,
}
export default exportsignup