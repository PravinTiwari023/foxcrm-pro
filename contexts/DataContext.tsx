import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase'; // Ensure this matches your export
import { useAuth } from './AuthContext';
import { Lead, Deal, FollowUpTask } from '../types';

interface DataContextType {
    leads: Lead[];
    deals: Deal[];
    tasks: FollowUpTask[];
    loading: boolean;
    addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
    updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    addDeal: (deal: Omit<Deal, 'id'>) => Promise<void>;
    updateDeal: (id: string, data: Partial<Deal>) => Promise<void>;
    moveDealStage: (id: string, newStage: string) => Promise<void>;
    addFollowUp: (task: Omit<FollowUpTask, 'id'>) => Promise<void>;
    updateTask: (id: string, data: Partial<FollowUpTask>) => Promise<void>;
    completeTask: (id: string) => Promise<void>;
    promoteToDeal: (leadId: string, dealData: any) => Promise<void>;
    error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [tasks, setTasks] = useState<FollowUpTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLeads([]);
            setDeals([]);
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // 1. Leads Subscription
        const leadsQuery = query(
            collection(db, 'leads'),
            where('userId', '==', user.uid)
        );

        const unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
            setLeads(leadsData);
            setError(null);
        }, (err) => {
            console.error("Leads listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        // 2. Deals Subscription
        const dealsQuery = query(
            collection(db, 'deals'),
            where('userId', '==', user.uid)
        );

        const unsubDeals = onSnapshot(dealsQuery, (snapshot) => {
            const dealsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
            setDeals(dealsData);
            setError(null);
        }, (err) => {
            console.error("Deals listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        // 3. Tasks Subscription
        const tasksQuery = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid)
        );

        const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate)
                } as FollowUpTask;
            });
            tasksData.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
            setTasks(tasksData);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Tasks listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => {
            unsubLeads();
            unsubDeals();
            unsubTasks();
        };
    }, [user]);

    // --- Actions ---

    const addLead = async (leadData: Omit<Lead, 'id'>) => {
        if (!user) return;
        await addDoc(collection(db, 'leads'), {
            ...leadData,
            userId: user.uid,
            createdAt: serverTimestamp()
        });
    };

    const updateLead = async (id: string, data: Partial<Lead>) => {
        await updateDoc(doc(db, 'leads', id), data);
    };

    const deleteLead = async (id: string) => {
        await deleteDoc(doc(db, 'leads', id));
    };

    const addDeal = async (dealData: Omit<Deal, 'id'>) => {
        if (!user) return;
        await addDoc(collection(db, 'deals'), {
            ...dealData,
            userId: user.uid,
            createdAt: serverTimestamp()
        });
    };

    const updateDeal = async (id: string, data: Partial<Deal>) => {
        await updateDoc(doc(db, 'deals', id), data);
    };

    const moveDealStage = async (id: string, newStage: string) => {
        await updateDoc(doc(db, 'deals', id), {
            stage: newStage,
            lastTouch: 'Just now',
            daysInStage: 0
        });
    };

    const addFollowUp = async (taskData: Omit<FollowUpTask, 'id'>) => {
        if (!user) return;
        await addDoc(collection(db, 'tasks'), {
            ...taskData,
            userId: user.uid,
            createdAt: serverTimestamp()
        });
    };

    const updateTask = async (id: string, data: Partial<FollowUpTask>) => {
        await updateDoc(doc(db, 'tasks', id), data);
    };

    const completeTask = async (id: string) => {
        await updateDoc(doc(db, 'tasks', id), {
            status: 'completed'
        });
    };

    const promoteToDeal = async (leadId: string, dealData: any) => {
        if (!user) return;

        // 1. Create deal
        await addDoc(collection(db, 'deals'), {
            ...dealData,
            userId: user.uid,
            leadId: leadId,
            createdAt: serverTimestamp()
        });

        // 2. Update lead status
        await updateDoc(doc(db, 'leads', leadId), {
            status: 'Qualified'
        });
    };

    return (
        <DataContext.Provider value={{
            leads, deals, tasks, loading, error,
            addLead, updateLead, deleteLead,
            addDeal, updateDeal, moveDealStage,
            addFollowUp, updateTask, completeTask,
            promoteToDeal
        }}>
            {children}
        </DataContext.Provider>
    );
};
