
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [loading, setLoading] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionInfo({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Checking subscription status for user:', user.email);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }

      console.log('Subscription check result:', data);
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Failed to check subscription:', error);
      toast({
        title: "Error",
        description: "No se pudo verificar el estado de la suscripción",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createCheckout = async (planId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para suscribirte",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Creating checkout session for plan:', planId);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }

      console.log('Checkout session created:', data);
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Failed to create checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la sesión de pago",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para gestionar tu suscripción",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Opening customer portal for user:', user.email);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        throw error;
      }

      console.log('Customer portal session created:', data);
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast({
        title: "Error",
        description: "No se pudo abrir el portal de gestión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    subscriptionInfo,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
