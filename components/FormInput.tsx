import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  error?: string;
  required?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  error,
  required = false,
  style,
  ...textInputProps
}: FormInputProps<T>) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.textInput, error && styles.textInputError, style]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...textInputProps}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
});
