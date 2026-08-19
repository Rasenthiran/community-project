import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button, Input, Select } from "../../components/common";
import { loginSchema, registerSchema } from "../../schemas";
import { authService } from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { roleHome } from "../../config/constants";
import { getErrorMessage } from "../../utils/errorHandler";
import "./auth.css";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register,handleSubmit,formState:{errors,isSubmitting} } = useForm({ resolver:zodResolver(loginSchema) });
  const submit = async values => {
    try {
      const user = await login(values);
      toast.success("Login successful.");
      navigate(location.state?.from || roleHome[user.role] || "/", {replace:true});
    } catch (e) { toast.error(getErrorMessage(e,"Invalid email or password.")); }
  };
  return <div className="auth-page"><form className="auth-card form-stack" onSubmit={handleSubmit(submit)}>
    <div className="auth-head"><span className="section-kicker">Welcome back</span><h1>Sign in to NovaCare</h1><p>Access your secure hospital workspace.</p></div>
    <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")}/>
    <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")}/>
    <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting?"Signing in...":"Sign In"}</Button>
    <div className="auth-foot">New patient? <Link to="/register">Create an account</Link></div>
  </form></div>;
}

export function Register() {
  const navigate = useNavigate();
  const { register,handleSubmit,formState:{errors,isSubmitting} } = useForm({ resolver:zodResolver(registerSchema), defaultValues:{gender:"male"} });
  const submit = async values => {
    try {
      await authService.register(values);
      toast.success("Registration successful. Please sign in.");
      navigate("/login");
    } catch (e) { toast.error(getErrorMessage(e,"Unable to register.")); }
  };
  return <div className="auth-page"><form className="auth-card wide" onSubmit={handleSubmit(submit)}>
    <div className="auth-head"><span className="section-kicker">Patient registration</span><h1>Create your patient account</h1><p>Public registration creates patient accounts only.</p></div>
    <div className="form-grid">
      <Input label="Full name" error={errors.fullName?.message} {...register("fullName")}/>
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")}/>
      <Input label="Phone number" error={errors.phoneNumber?.message} {...register("phoneNumber")}/>
      <Select label="Gender" {...register("gender")}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></Select>
      <Input label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")}/>
      <Input label="National ID (optional)" {...register("nationalId")}/>
      <Input label="Address" error={errors.address?.message} {...register("address")}/>
      <Input label="City" error={errors.city?.message} {...register("city")}/>
      <Input label="Emergency contact name" {...register("emergencyContactName")}/>
      <Input label="Emergency contact phone" {...register("emergencyContactPhone")}/>
      <Input label="Password" type="password" error={errors.password?.message} {...register("password")}/>
      <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")}/>
    </div>
    <Button className="w-full mt-24" type="submit" size="lg" disabled={isSubmitting}>{isSubmitting?"Creating account...":"Create Patient Account"}</Button>
    <div className="auth-foot">Already registered? <Link to="/login">Sign in</Link></div>
  </form></div>;
}
