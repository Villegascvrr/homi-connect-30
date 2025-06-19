import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSwipes(userId?: string) {
  const [hasReachedDailyLimit, setHasReachedDailyLimit] = useState(false);

  // Función para obtener el recuento de matches y discards de hoy para el usuario
  const getTodayCounts = useCallback(async () => {
    if (!userId) return 0;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Rango de hoy
    const from = `${todayStr}T00:00:00.000Z`;
    const to = `${todayStr}T23:59:59.999Z`;

    // profile_matches
    const { count: matchesCount } = await supabase
      .from('profile_matches')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .gte('created_at', from)
      .lte('created_at', to);

    // profile_discards
    const { count: discardsCount } = await supabase
      .from('profile_discards')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .gte('created_at', from)
      .lte('created_at', to);

    const totalTodayActions = (matchesCount || 0) + (discardsCount || 0);
    return totalTodayActions;
  }, [userId]);

  // Comprobar el límite al montar o cuando cambie el usuario
  const checkDailyLimit = useCallback(async () => {
    if (!userId) return;
    const total = await getTodayCounts();
    setHasReachedDailyLimit(total >= 20);
  }, [userId, getTodayCounts]);

  // Llamar después de cada acción de swipe
  const updateDailyLimitAfterAction = useCallback(async () => {
    if (!userId) return false;
    const total = await getTodayCounts();
    if (total >= 20) {
      setHasReachedDailyLimit(true);
      return true;
    }
    return false;
  }, [userId, getTodayCounts]);

  return {
    hasReachedDailyLimit,
    checkDailyLimit,
    updateDailyLimitAfterAction,
  };
} 