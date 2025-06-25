import { useState, useEffect } from 'react';

// Mock subscription data
interface SubscriptionInfo {
  isActive: boolean;
  planId: string | null;
  expirationDate: Date | null;
  isTrialPeriod: boolean;
}

interface SubscriptionHook {
  subscription: SubscriptionInfo;
  isLoading: boolean;
  showPaywall: () => void;
  hidePaywall: () => void;
  isPaywallVisible: boolean;
  restorePurchases: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
}

export function useSubscription(): SubscriptionHook {
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    isActive: false,
    planId: null,
    expirationDate: null,
    isTrialPeriod: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);

  // Mock initialization
  useEffect(() => {
    const initializeSubscription = async () => {
      setIsLoading(true);
      
      // Simulate API call to check subscription status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock subscription data - in real app this would come from RevenueCat
      const mockSubscription: SubscriptionInfo = {
        isActive: false, // Change to true to test premium features
        planId: null,
        expirationDate: null,
        isTrialPeriod: false,
      };
      
      setSubscription(mockSubscription);
      setIsLoading(false);
    };

    initializeSubscription();
  }, []);

  const showPaywall = () => {
    setIsPaywallVisible(true);
  };

  const hidePaywall = () => {
    setIsPaywallVisible(false);
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    
    try {
      // Mock restore purchases
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would call RevenueCat's restore method
      console.log('Restoring purchases...');
      
      // Mock: No purchases found
      return Promise.resolve();
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    setIsLoading(true);
    
    try {
      // Mock subscription status check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would call RevenueCat's getCustomerInfo method
      console.log('Checking subscription status...');
      
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscription,
    isLoading,
    showPaywall,
    hidePaywall,
    isPaywallVisible,
    restorePurchases,
    checkSubscriptionStatus,
  };
}

// Helper hook to check if user has premium access
export function usePremiumFeatures() {
  const { subscription } = useSubscription();
  
  return {
    hasUnlimitedClothing: subscription.isActive,
    hasAdvancedStats: subscription.isActive,
    hasAIStylist: subscription.isActive,
    hasPrioritySupport: subscription.isActive,
    hasCloudBackup: subscription.isActive,
    canShareUnlimited: subscription.isActive,
  };
}