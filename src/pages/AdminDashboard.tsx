import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, RefreshCw, Pencil, Trash2, Calendar, DollarSign, Users, Clock, KeyRound } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"booking_requests">;

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"] as const;

const statusColor = (s: string) => {
  switch (s) {
    case "confirmed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "cancelled": return "bg-destructive/20 text-destructive border-destructive/30";
    default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase
      .from("booking_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    const { data } = await query;
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user && isAdmin) fetchBookings();
  }, [user, isAdmin, statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase.from("booking_requests").update({ status }).eq("id", id);
    fetchBookings();
  };

  const handleEdit = (b: Booking) => {
    setEditBooking(b);
    setEditForm({ ...b });
  };

  const handleSaveEdit = async () => {
    if (!editBooking) return;
    const { id, created_at, ...rest } = editForm as Booking;
    await supabase.from("booking_requests").update(rest).eq("id", editBooking.id);
    setEditBooking(null);
    fetchBookings();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("booking_requests").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchBookings();
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated!" });
      setNewPassword("");
    }
  };

  if (authLoading || !isAdmin) return null;

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.quoted_total).reduce((s, b) => s + (b.quoted_total || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Booking Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={() => setShowPassword(true)} title="Change password">
            <KeyRound className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/admin/login"); }}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total, icon: Users },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Confirmed", value: stats.confirmed, icon: Calendar },
            { label: "Quoted Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign },
          ].map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                  <p className="text-foreground text-xl font-semibold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchBookings}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Table */}
        <Card className="border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No booking requests found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{b.guest_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{b.guest_email || ""}</p>
                        {b.guest_phone && <p className="text-xs text-muted-foreground">{b.guest_phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{b.service_type}</TableCell>
                    <TableCell>{b.vehicle_type || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{b.requested_date || "—"}</p>
                        <p className="text-muted-foreground">{b.requested_time || ""}</p>
                      </div>
                    </TableCell>
                    <TableCell>{b.quoted_total ? `$${b.quoted_total}` : "—"}</TableCell>
                    <TableCell>
                      <Select value={b.status} onValueChange={(v) => handleUpdateStatus(b.id, v)}>
                        <SelectTrigger className="w-28 h-7 text-xs p-1">
                          <Badge variant="outline" className={`${statusColor(b.status)} text-xs`}>
                            {b.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(b)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editBooking} onOpenChange={(o) => !o && setEditBooking(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {([
              ["guest_name", "Guest Name"],
              ["guest_email", "Email"],
              ["guest_phone", "Phone"],
              ["pickup_location", "Pickup"],
              ["dropoff_location", "Dropoff"],
              ["requested_date", "Date"],
              ["requested_time", "Time"],
              ["quoted_total", "Quoted Total ($)"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground">{label}</label>
                <Input
                  value={String(editForm[key] ?? "")}
                  onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <Select
                value={editForm.status || "pending"}
                onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBooking(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking request?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
