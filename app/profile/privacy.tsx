/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Politique de Confidentialité</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.body}>
          Cette politique de confidentialité décrit comment Kapps (« nous », «
          notre » ou « nos ») collecte, utilise, partage et protège vos
          informations lorsque vous utilisez l'application Dress'n Party («
          l'Application »).
        </Text>

        <Text style={styles.section}>1. Informations collectées</Text>
        <Text style={styles.subtitle}>Informations que vous fournissez</Text>
        <Text style={styles.body}>
          Lorsque vous créez un compte, complétez votre profil, ou interagissez
          avec l'Application, nous collectons les informations que vous
          fournissez, telles que votre nom, adresse e-mail, nom d'utilisateur,
          photo de profil, et toute information que vous ajoutez à votre
          garde-robe ou à vos tenues.
        </Text>
        <Text style={styles.subtitle}>
          Informations collectées automatiquement
        </Text>
        <Text style={styles.body}>
          Nous collectons automatiquement certaines informations techniques
          lorsque vous utilisez Dress'n Party, telles que l'adresse IP, le type
          d'appareil, le système d'exploitation, les identifiants uniques, les
          données de journalisation, et des informations sur votre utilisation
          de l'Application.
        </Text>

        <Text style={styles.section}>2. Utilisation des informations</Text>
        <Text style={styles.body}>Nous utilisons vos informations pour :</Text>
        <Text style={styles.body}>
          - Fournir, exploiter et améliorer Dress'n Party ; - Gérer votre compte
          et vos préférences ; - Personnaliser votre expérience et vous proposer
          des suggestions ; - Communiquer avec vous concernant l'Application,
          les mises à jour ou le support ; - Assurer la sécurité et prévenir la
          fraude ; - Respecter nos obligations légales.
        </Text>

        <Text style={styles.section}>3. Partage des informations</Text>
        <Text style={styles.body}>
          Nous ne partageons pas vos informations personnelles avec des tiers,
          sauf dans les cas suivants :
        </Text>
        <Text style={styles.body}>
          - Avec votre consentement ; - Pour fournir et améliorer l'Application
          avec des prestataires de services (hébergement, analyse, support
          technique) ; - Si la loi l'exige ou pour répondre à une procédure
          judiciaire ; - Pour protéger les droits, la sécurité ou la propriété
          de Kapps, de nos utilisateurs ou du public.
        </Text>

        <Text style={styles.section}>4. Sécurité</Text>
        <Text style={styles.body}>
          Nous mettons en œuvre des mesures de sécurité techniques et
          organisationnelles pour protéger vos informations contre l'accès, la
          divulgation, l'altération ou la destruction non autorisés. Cependant,
          aucune méthode de transmission ou de stockage électronique n'est
          totalement sécurisée.
        </Text>

        <Text style={styles.section}>5. Vos droits</Text>
        <Text style={styles.body}>
          Vous pouvez accéder à vos informations, les corriger, les mettre à
          jour ou les supprimer depuis votre compte. Vous pouvez également nous
          contacter à lesieurkim@gmail.com pour toute demande relative à vos
          données personnelles.
        </Text>

        <Text style={styles.section}>6. Conservation des données</Text>
        <Text style={styles.body}>
          Nous conservons vos informations aussi longtemps que nécessaire pour
          fournir l'Application et respecter nos obligations légales. Vous
          pouvez demander la suppression de votre compte à tout moment.
        </Text>

        <Text style={styles.section}>7. Modifications de la politique</Text>
        <Text style={styles.body}>
          Nous pouvons mettre à jour cette politique de confidentialité. Toute
          modification sera publiée dans l'Application. Nous vous encourageons à
          consulter régulièrement cette page.
        </Text>

        <Text style={styles.section}>8. Contact</Text>
        <Text style={styles.body}>
          Pour toute question concernant cette politique de confidentialité ou
          vos données personnelles, contactez-nous à : lesieurkim@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // to balance the back button
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
    lineHeight: 22,
    textAlign: 'justify',
  },
});
