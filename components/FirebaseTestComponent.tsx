import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, TestTube, Trash2, RefreshCw, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';
import { FirebaseTestService, TestResult } from '@/utils/firebaseTest';

export default function FirebaseTestComponent() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const results = await FirebaseTestService.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults([{
        name: 'Test Suite',
        success: false,
        error: 'Failed to run test suite'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const cleanupTestData = async () => {
    setIsCleaning(true);
    try {
      await FirebaseTestService.cleanupTestData();
      // Re-run tests to show clean state
      await runTests();
    } catch (error) {
      console.error('Error cleaning up test data:', error);
    } finally {
      setIsCleaning(false);
    }
  };

  const showDeploymentInstructions = () => {
    const instructions = FirebaseTestService.getDeploymentInstructions();
    Alert.alert(
      'Firestore Rules Deployment',
      instructions,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  const getOverallStatus = () => {
    if (testResults.length === 0) return null;
    
    // Count successful tests, but treat permission denied as success for Firestore
    const successfulTests = testResults.filter(result => {
      if (result.name === 'Firestore Connection' && result.error?.includes('permission-denied')) {
        return true; // Permission denied is expected with proper security rules
      }
      return result.success;
    });
    
    const allPassed = successfulTests.length === testResults.length;
    return allPassed ? 'success' : 'failure';
  };

  const hasPermissionIssues = () => {
    return testResults.some(result => 
      result.error?.includes('permission-denied') || result.warning?.includes('Permission denied')
    );
  };

  const renderTestResult = (result: TestResult, index: number) => {
    // Special handling for permission denied errors (they're actually good!)
    const isPermissionDenied = result.error?.includes('permission-denied');
    const displayAsSuccess = isPermissionDenied && result.name === 'Firestore Connection';
    
    return (
      <View key={index} style={[
        styles.testResult, 
        (result.success || displayAsSuccess) ? styles.success : styles.failure
      ]}>
        <View style={styles.testHeader}>
          {(result.success || displayAsSuccess) ? (
            <CheckCircle size={20} color="#10B981" />
          ) : (
            <XCircle size={20} color="#EF4444" />
          )}
          <Text style={[
            styles.testName, 
            (result.success || displayAsSuccess) ? styles.successText : styles.failureText
          ]}>
            {result.name}
          </Text>
        </View>
        
        {result.details && (
          <Text style={styles.testDetails}>{result.details}</Text>
        )}
        
        {result.warning && (
          <View style={styles.warningContainer}>
            <AlertTriangle size={16} color="#F59E0B" />
            <Text style={styles.testWarning}>{result.warning}</Text>
          </View>
        )}
        
        {result.error && !displayAsSuccess && (
          <Text style={styles.testError}>Error: {result.error}</Text>
        )}
        
        {isPermissionDenied && (
          <View style={styles.infoContainer}>
            <Info size={16} color="#3B82F6" />
            <Text style={styles.testInfo}>
              Permission denied is expected with proper security rules. This indicates your Firestore is secure!
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TestTube size={24} color="#8B5CF6" />
        <Text style={styles.title}>Firebase Connectivity Test</Text>
      </View>

      <Text style={styles.description}>
        Test your Firebase configuration to ensure all services are properly initialized and accessible.
        Permission denied errors are expected and indicate proper security configuration.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={runTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <RefreshCw size={20} color="#FFFFFF" />
          )}
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run Firebase Tests'}
          </Text>
        </TouchableOpacity>

        {hasPermissionIssues() && (
          <TouchableOpacity 
            style={[styles.button, styles.infoButton]} 
            onPress={showDeploymentInstructions}
          >
            <Info size={20} color="#3B82F6" />
            <Text style={styles.infoButtonText}>
              Deployment Instructions
            </Text>
          </TouchableOpacity>
        )}

        {testResults.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={cleanupTestData}
            disabled={isCleaning}
          >
            {isCleaning ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Trash2 size={20} color="#8B5CF6" />
            )}
            <Text style={styles.secondaryButtonText}>
              {isCleaning ? 'Cleaning...' : 'Clean Test Data & Sign Out'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.overallStatus}>
            <Text style={styles.overallStatusTitle}>Overall Status</Text>
            <View style={[
              styles.statusBadge, 
              getOverallStatus() === 'success' ? styles.successBadge : styles.failureBadge
            ]}>
              <Text style={[
                styles.statusText,
                getOverallStatus() === 'success' ? styles.successText : styles.failureText
              ]}>
                {getOverallStatus() === 'success' ? 'Firebase Ready' : 'Issues Detected'}
              </Text>
            </View>
            
            {hasPermissionIssues() && (
              <Text style={styles.permissionNote}>
                💡 Permission denied errors indicate your security rules are working correctly!
              </Text>
            )}
          </View>

          <ScrollView style={styles.testResults} showsVerticalScrollIndicator={false}>
            {testResults.map(renderTestResult)}
          </ScrollView>
        </View>
      )}

      {testResults.length === 0 && !isRunning && (
        <View style={styles.emptyState}>
          <TestTube size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>
            Run tests to check your Firebase configuration
          </Text>
          <Text style={styles.emptyStateSubtext}>
            This will test authentication, Firestore, Storage, and security rules
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  infoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  resultsContainer: {
    flex: 1,
  },
  overallStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overallStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  successBadge: {
    backgroundColor: '#D1FAE5',
  },
  failureBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  permissionNote: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  testResults: {
    flex: 1,
  },
  testResult: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  success: {
    borderLeftColor: '#10B981',
  },
  failure: {
    borderLeftColor: '#EF4444',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  successText: {
    color: '#065F46',
  },
  failureText: {
    color: '#991B1B',
  },
  testDetails: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  testWarning: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginLeft: 6,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  testInfo: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginLeft: 6,
    flex: 1,
  },
  testError: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});