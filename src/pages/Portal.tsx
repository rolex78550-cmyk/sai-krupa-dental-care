import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FileText, Star, Plus, Bell, Clock, LogIn, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { signInWithGoogle } from '../lib/firebase';

export default function Portal() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'reviews'>('appointments');
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // New Appointment Form
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appDate, setAppDate] = useState('');
  const [appTime, setAppTime] = useState('');
  const [appService, setAppService] = useState('Checkup');

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setFetching(true);
    try {
      // Fetch Appointments
      const qAppointments = query(collection(db, 'appointments'), where('userId', '==', user.uid));
      const appSnap = await getDocs(qAppointments).catch(e => handleFirestoreError(e, OperationType.LIST, 'appointments'));
      const appsData = appSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // simple sort (since we don't have composite index for orderby atm, client side sort)
      appsData.sort((a: any, b: any) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      setAppointments(appsData);

      // Fetch Records
      const qRecords = query(collection(db, 'records'), where('userId', '==', user.uid));
      const recSnap = await getDocs(qRecords).catch(e => handleFirestoreError(e, OperationType.LIST, 'records'));
      const recData = recSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      recData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(recData);

    } catch (error) {
      console.error(error);
    }
    setFetching(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        date: appDate,
        time: appTime,
        status: 'upcoming',
        serviceType: appService,
        reminderSet: true,
        createdAt: serverTimestamp()
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'appointments'));
      setShowNewAppointment(false);
      setAppDate('');
      setAppTime('');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleReminder = async (appId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'appointments', appId), {
        reminderSet: !currentStatus
      }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `appointments/${appId}`));
      setAppointments(prev => prev.map(a => a.id === appId ? { ...a, reminderSet: !currentStatus } : a));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setReviewSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        authorName: user.displayName || 'Patient',
        rating,
        comment,
        createdAt: serverTimestamp()
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'reviews'));
      setComment('');
      setRating(5);
      alert('Thank you for your review!');
    } catch (err) {
      console.error('Error submitting review:', err);
    }
    setReviewSubmitting(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Patient Portal</h2>
          <p className="text-slate-500 mb-8">Sign in to track your appointments, view your dental records, and set reminders.</p>
          <button
            onClick={() => signInWithGoogle().catch(console.error)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-base font-medium text-white shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all hover:-translate-y-0.5"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: CalendarIcon },
    { id: 'records', label: 'Dental Records', icon: FileText },
    { id: 'reviews', label: 'Leave Review', icon: Star }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Welcome, {user.displayName?.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-2">Manage your dental health with Sai Krupa.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[500px]">
            {fetching ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* APPOINTMENTS TAB */}
                  {activeTab === 'appointments' && (
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-slate-900">Your Appointments</h2>
                        <button 
                          onClick={() => setShowNewAppointment(!showNewAppointment)}
                          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors"
                        >
                          {showNewAppointment ? 'Cancel' : <><Plus className="w-4 h-4"/> Schedule</>}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showNewAppointment && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-8"
                          >
                            <form onSubmit={handleCreateAppointment} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                              <h3 className="font-semibold text-slate-900 mb-4">Schedule New Appointment</h3>
                              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                  <input 
                                    type="date" 
                                    required
                                    value={appDate}
                                    onChange={(e) => setAppDate(e.target.value)}
                                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2.5 px-3 border"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                  <input 
                                    type="time" 
                                    required
                                    value={appTime}
                                    onChange={(e) => setAppTime(e.target.value)}
                                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2.5 px-3 border"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                                  <select 
                                    value={appService}
                                    onChange={(e) => setAppService(e.target.value)}
                                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 py-2.5 px-3 border bg-white"
                                  >
                                    <option>Checkup</option>
                                    <option>Cleaning</option>
                                    <option>Consultation</option>
                                    <option>Root Canal</option>
                                    <option>Extraction</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <button type="submit" className="rounded-2xl bg-teal-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-teal-100 hover:bg-teal-700 hover:-translate-y-0.5 transition-all">
                                  Confirm Booking
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        {appointments.length === 0 ? (
                          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                            <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No upcoming appointments.</p>
                          </div>
                        ) : (
                          appointments.map(app => (
                            <div key={app.id} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow gap-4">
                              <div className="flex items-center gap-5 w-full sm:w-auto">
                                <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold uppercase">{app.date ? format(new Date(app.date), 'MMM') : ''}</span>
                                  <span className="text-xl font-display font-bold leading-none">{app.date ? format(new Date(app.date), 'dd') : ''}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900 text-lg">{app.serviceType}</h4>
                                  <div className="flex items-center text-sm text-slate-500 gap-3 mt-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{app.time}</span>
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide",
                                      app.status === 'upcoming' ? "bg-amber-100 text-amber-800" :
                                      app.status === 'completed' ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                                    )}>
                                      {app.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="w-full sm:w-auto flex justify-end">
                                {app.status === 'upcoming' && (
                                  <button 
                                    onClick={() => toggleReminder(app.id, app.reminderSet)}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                                      app.reminderSet 
                                        ? "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100" 
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    )}
                                  >
                                    <Bell className={cn("w-4 h-4", app.reminderSet ? "fill-teal-700" : "")} />
                                    {app.reminderSet ? 'Reminder On' : 'Set Reminder'}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* RECORDS TAB */}
                  {activeTab === 'records' && (
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Dental Records</h2>
                      
                      <div className="space-y-4">
                        {records.length === 0 ? (
                          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No dental records found.</p>
                            <p className="text-sm text-slate-400 mt-1">Records will appear here after your visits.</p>
                          </div>
                        ) : (
                          records.map(rec => (
                            <div key={rec.id} className="p-6 rounded-2xl border border-slate-200 bg-white">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-lg">{rec.title}</h4>
                                  <span className="text-sm text-slate-500">{rec.date ? format(new Date(rec.date), 'MMMM d, yyyy') : ''}</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                  <FileText className="w-5 h-5" />
                                </div>
                              </div>
                              <p className="text-slate-700">{rec.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === 'reviews' && (
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Leave a Review</h2>
                      <p className="text-slate-500 mb-8">Your feedback helps us provide the best care.</p>
                      
                      <form onSubmit={handleSubmitReview} className="max-w-xl">
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-900 mb-3">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md transition-transform hover:scale-110"
                              >
                                <Star className={cn("w-8 h-8", rating >= star ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-900 mb-2">Your Review</label>
                          <textarea
                            required
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full rounded-2xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-4 border resize-none bg-slate-50"
                          ></textarea>
                        </div>

                        <button 
                          disabled={reviewSubmitting}
                          type="submit" 
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-3.5 text-base font-medium text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {reviewSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
