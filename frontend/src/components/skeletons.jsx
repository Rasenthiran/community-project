import { LoadingState } from "./common";

export function DoctorCardSkeleton() { return <LoadingState rows={4} />; }
export function DashboardSkeleton() { return <LoadingState rows={6} />; }
export function TableSkeleton() { return <LoadingState rows={7} />; }
export function ProfileSkeleton() { return <LoadingState rows={5} />; }
export function AppointmentSkeleton() { return <LoadingState rows={4} />; }
export function PageSkeleton() { return <LoadingState rows={8} />; }
