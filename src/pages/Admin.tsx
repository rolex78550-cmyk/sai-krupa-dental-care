import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { ShieldAlert, Users, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'users'>('appointments');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // New Record Form
  const [selectedUserForRecord, setSelectedUserForRecord] = useState<string | null>(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDesc, setRecordDesc] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setFetching(true);
    try {
      // Fetch Appointments representing all users
      const qAppointments = query(collection(db, 'appointments'));
      const appSnap = await getDocs(qAppointments).catch(e => handleFirestoreError(e, OperationType.LIST, 'appointments'));
      const appsData = appSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      appsData.sort((a: any, b: any) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      setAppointments(appsData);

      // Fetch Users
      const qUsers = query(collection(db, 'users'));
      const userSnap = await getDocs(qUsers).catch(e => handleFirestoreError(e, OperationType.LIST, 'users'));
      const userData = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(userData);

    } catch (error) {
      console.error(error);
    }
    setFetching(false);
  };

  const updateAppointmentStatus = async (appId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appId), {
        status: newStatus
      }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `appointments/${appId}`));
      setAppointments(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRecord) return;
    try {
      await addDoc(collection(db, 'records'), {
        userId: selectedUserForRecord,
        title: recordTitle,
        description: recordDesc,
        date: recordDate,
        createdAt: serverTimestamp()
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'records'));
      
      setSelectedUserForRecord(null);
      setRecordTitle('');
      setRecordDesc('');
      alert('Record added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12 min-h-screen">Loading...</div>
  );
  
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 w-full text-center min-h-[70vh] flex flex-col justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <ShieldAlert className="w-12 h-12 text-teal-600 mb-4" />
          <h1 className="text-2xl font-bold font-display text-slate-900 mb-2">Admin Access</h1>
          <p className="text-slate-500 mb-8">Please sign in to access the clinic dashboard.</p>
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

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 w-full text-center min-h-[70vh] flex flex-col justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 flex flex-col items-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold font-display text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You do not have administrative privileges to view this page.</p>
          <Link to="/portal" className="text-teal-600 font-medium hover:underline">
            Return to Patient Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Admin
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Clinic Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage appointments and patient records.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab('appointments')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === 'appointments'
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Calendar className="w-5 h-5 shrink-0" />
              All Appointments
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === 'users'
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Users className="w-5 h-5 shrink-0" />
              Patients & Records
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 min-h-[500px]">
            {fetching ? (
              <div className="flex items-center justify-center p-12">Loading...</div>
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
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">All Appointments</h2>
                      <div className="space-y-4">
                        {appointments.filter(a => a.status === 'upcoming').length === 0 && appointments.length > 0 && (
                           <p className="text-slate-500 mb-4">No upcoming appointments.</p>
                        )}
                        {appointments.map(app => (
                          <div key={app.id} className={cn(
                            "flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white gap-4",
                            app.status === 'completed' && "opacity-60"
                          )}>
                            <div className="flex items-center gap-5 w-full sm:w-auto">
                              <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold uppercase">{app.date ? format(new Date(app.date), 'MMM') : ''}</span>
                                <span className="text-xl font-display font-bold leading-none">{app.date ? format(new Date(app.date), 'dd') : ''}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 text-lg">
                                  {usersList.find(u => u.id === app.userId)?.displayName || 'Patient'}
                                  <span className="text-sm font-normal text-slate-500 ml-2">({app.serviceType})</span>
                                </h4>
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
                            
                            <div className="w-full sm:w-auto flex justify-end gap-2">
                              {app.status === 'upcoming' && (
                                <>
                                  <button 
                                    onClick={() => updateAppointmentStatus(app.id, 'completed')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
                                  >
                                    <CheckCircle className="w-4 h-4"/> Complete
                                  </button>
                                  <button 
                                    onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200 transition"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* USERS TAB */}
                  {activeTab === 'users' && (
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Patients Directory</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {usersList.filter(u => u.role !== 'admin').map(u => (
                          <div key={u.id} className="p-5 border border-slate-200 rounded-2xl">
                            <h4 className="font-bold text-slate-900">{u.displayName}</h4>
                            <p className="text-sm text-slate-500 mb-4">{u.email}</p>
                            <button
                              onClick={() => setSelectedUserForRecord(u.id)}
                              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
                            >
                              Add Dental Record <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Record Modal/Form */}
                      {selectedUserForRecord && (
                        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl relative">
                          <button 
                            onClick={() => setSelectedUserForRecord(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                          >
                            Close
                          </button>
                          <h3 className="text-lg font-bold text-slate-900 mb-4">
                            Add Record for {usersList.find(u => u.id === selectedUserForRecord)?.displayName}
                          </h3>
                          <form onSubmit={handleCreateRecord} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                              <input 
                                required
                                value={recordTitle}
                                onChange={e => setRecordTitle(e.target.value)}
                                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2.5 border"
                                placeholder="e.g. Root Canal Treatment"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                              <input 
                                type="date"
                                required
                                value={recordDate}
                                onChange={e => setRecordDate(e.target.value)}
                                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2.5 border"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                              <textarea 
                                required
                                value={recordDesc}
                                onChange={e => setRecordDesc(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2.5 border resize-none"
                                placeholder="Details of the procedure, prescriptions..."
                              />
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white font-medium py-3 rounded-xl hover:bg-teal-700 transition">
                              Save Record
                            </button>
                          </form>
                        </div>
                      )}
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
