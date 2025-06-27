/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
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

export default function CGUScreen() {
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
        <Text style={styles.headerTitle}>
          Conditions générales d&apos;utilisation
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.body}>
          Ces Conditions d&apos;Utilisation (« Conditions ») régissent votre accès et votre utilisation du site web, de l&apos;application et des widgets de Dress&apos;n Party (« Dress&apos;n Party » ou le « Service »). Veuillez lire attentivement ces Conditions et nous contacter si vous avez des questions. En accédant ou en utilisant Dress&apos;n Party, vous acceptez d&apos;être lié par ces Conditions et notre Politique de Confidentialité. Si vous n&apos;acceptez pas ces conditions, ou toute autre condition supplémentaire mentionnée ici, vous ne devez pas accéder à Dress&apos;n Party. Comme nous pouvons modifier n&apos;importe quelle condition à tout moment, vous devriez visiter cette page périodiquement pour consulter toutes les conditions actuelles. Ce Service vous est fourni par Kapps, Inc. (« Kapps », « nous », « notre » ou « nos »).
        </Text>

        <Text style={styles.section}>Notre service</Text>
        <Text style={styles.body}>
          Dress&apos;n Party est une plateforme numérique qui offre un moyen pratique
          de numériser et de stocker vos vêtements, facilitant ainsi le suivi de
          votre garde-robe et l'accès à vos vêtements de n'importe où. Avec
          Dress&apos;n Party, vous pouvez également composer des tenues, les partager
          avec d'autres et obtenir des suggestions de nouvelles tenues basées
          sur vos vêtements existants. En plus de ces fonctionnalités, Dress&apos;n
          Party exploite également une place de marché de pair à pair où les
          utilisateurs peuvent acheter et vendre des articles vestimentaires
          entre eux.
        </Text>
        <Text style={styles.body}>
          Lorsqu&apos;un utilisateur achète des articles sur la plateforme, le
          contrat de vente est directement conclu entre l&apos;acheteur et le
          vendeur, et Dress&apos;n Party n&apos;est pas partie à de telles transactions.
          Cependant, il est important de noter qu&apos;il existe des risques à
          traiter avec d&apos;autres personnes sur la plateforme, et les utilisateurs
          sont seuls responsables de leur évaluation et de leurs décisions
          d&apos;utiliser le Service, ainsi que de toute action qu&apos;ils entreprennent
          sur le Service.
        </Text>

        <Text style={styles.section}>Utiliser Dress&apos;n Party</Text>
        <Text style={styles.subtitle}>Qui peut utiliser Dress&apos;n Party</Text>
        <Text style={styles.body}>
          Vous ne pouvez utiliser Dress&apos;n Party que si vous pouvez légalement
          conclure un contrat contraignant avec nous, et uniquement en
          conformité avec ces Conditions et toutes les lois applicables. Lorsque
          vous créez votre compte Dress&apos;n Party, vous devez nous fournir des
          informations exactes et complètes. Toute utilisation ou accès par une
          personne de moins de 13 ans est interdit. Vous êtes responsable du
          maintien de la confidentialité de vos informations de connexion et de
          toutes les activités qui se déroulent sur votre Compte. Si vous
          craignez que votre Compte ait pu être utilisé à mauvais escient, vous
          devez nous contacter. L&apos;utilisation de Dress&apos;n Party peut inclure le
          téléchargement de logiciels sur votre ordinateur, téléphone, tablette
          ou autres appareils. En utilisant Dress&apos;n Party, vous acceptez que
          nous puissions mettre à jour automatiquement ce logiciel, et ces
          Conditions s&apos;appliqueront à toutes les mises à jour.
        </Text>
        <Text style={styles.subtitle}>Notre licence pour vous</Text>
        <Text style={styles.body}>
          Sous réserve de ces Conditions et de nos politiques, nous vous
          accordons une licence limitée, non exclusive, non transférable et
          révocable pour utiliser notre Service.
        </Text>

        <Text style={styles.section}>Vos contenus</Text>
        <Text style={styles.subtitle}>Publier des contenus</Text>
        <Text style={styles.body}>
          Dress&apos;n Party vous permet de publier des contenus, y compris des
          photos, des commentaires, des liens et d'autres matériaux. Tout ce que
          vous publiez ou mettez à disposition sur Dress&apos;n Party est désigné
          comme « Contenu Utilisateur ». Vous conservez tous les droits sur le
          Contenu Utilisateur que vous publiez sur Dress&apos;n Party et en êtes seul
          responsable. Lorsque vous soumettez du contenu à Dress&apos;n Party, vous
          déclarez et garantissez que vous possédez tous les droits sur le
          contenu ou que vous avez la permission du propriétaire de le
          soumettre. Le contenu est destiné à être partagé avec d'autres
          utilisateurs sur la plateforme. Dress&apos;n Party peut enquêter, engager
          une action en justice ou prendre toute autre mesure nécessaire pour
          gérer le service, votre contenu et votre utilisation du service. Cela
          peut inclure la conservation d'informations à des fins d'enquête.
        </Text>
        <Text style={styles.subtitle}>
          Comment Kapps et Dress&apos;n Party peuvent utiliser votre contenu
        </Text>
        <Text style={styles.body}>
          Vous accordez à Kapps Inc. et à ses sociétés affiliées ainsi qu'aux
          fournisseurs de services nécessaires une licence non exclusive, libre
          de redevance, transférable, sous-licenciable et mondiale pour
          utiliser, stocker, afficher, reproduire, sauvegarder, modifier,
          adapter, créer des œuvres dérivées, exécuter, concéder sous licence,
          et distribuer votre Contenu Utilisateur. Cette licence est accordée
          aux fins suivantes :
        </Text>
        <Text style={styles.body}>
          L'exploitation, la fourniture, la maintenance, la sécurisation et la
          promotion du Service Dress&apos;n Party ;
        </Text>
        <Text style={styles.body}>
          L'amélioration et le développement des services, fonctionnalités et
          technologies actuels et futurs de Dress&apos;n Party. Cela inclut l'analyse
          du Contenu Utilisateur (tel que le texte des chats, les images
          téléchargées et les métadonnées associées générées par des
          fonctionnalités comme le Chat IA et les outils de Traitement d'Image
          IA) pour comprendre les modèles d'utilisation, améliorer la qualité du
          service et développer de nouvelles fonctionnalités. Notre utilisation
          de vos informations personnelles au sein du Contenu Utilisateur à
          cette fin est également soumise à votre consentement tel que décrit
          dans notre Politique de Confidentialité.
        </Text>
        <Text style={styles.body}>
          Rien dans ces Conditions ne restreint les autres droits légaux que
          Kapps pourrait avoir sur le Contenu Utilisateur (par exemple, en vertu
          d'autres licences ou de la loi applicable). Nous nous réservons le
          droit de supprimer ou de modifier le Contenu Utilisateur, ou de
          changer la manière dont il est utilisé dans Dress&apos;n Party, pour
          quelque raison que ce soit, y compris le Contenu Utilisateur que nous
          estimons violer ces Conditions ou nos politiques, avec ou sans
          préavis. Cependant, Kapps ne contrôle pas et n'est pas responsable de
          la manière dont les autres utilisateurs peuvent utiliser votre Contenu
          Utilisateur partagé publiquement.
        </Text>
        <Text style={styles.subtitle}>
          Combien de temps nous conservons votre contenu
        </Text>
        <Text style={styles.body}>
          Suite à la résiliation ou à la désactivation de votre compte, ou si
          vous supprimez tout Contenu Utilisateur de Dress&apos;n Party, nous
          conserverons votre Contenu Utilisateur pendant une période raisonnable à
          des fins de sauvegarde, d'archivage ou d'audit. Kapps et ses
          utilisateurs peuvent conserver et continuer à utiliser, stocker,
          afficher, reproduire, modifier, créer des œuvres dérivées, exécuter et
          distribuer tout Contenu Utilisateur que d'autres utilisateurs ont
          stocké ou partagé sur Dress&apos;n Party.
        </Text>
        <Text style={styles.subtitle}>Vos commentaires</Text>
        <Text style={styles.body}>
          Nous apprécions les retours de nos utilisateurs et sommes toujours
          intéressés à découvrir comment nous pouvons améliorer Dress&apos;n Party.
          Si vous choisissez de soumettre des commentaires, des idées ou des
          retours, vous acceptez que nous soyons libres de les utiliser sans
          aucune restriction ni compensation pour vous. Accepter votre
          soumission ne signifie pas que Dress&apos;n Party renonce à tout droit
          d'utiliser des retours similaires ou connexes déjà connus de Dress&apos;n
          Party, développés par ses employés ou obtenus d'autres sources que
          vous.
        </Text>

        {/* Abonnement */}
        <Text style={styles.section}>Abonnement</Text>
        <Text style={styles.subtitle}>Paiement de l'abonnement</Text>
        <Text style={styles.body}>
          Vous avez la possibilité de mettre à niveau votre compte Dress&apos;n Party avec un espace de garde-robe supplémentaire en souscrivant à des forfaits. Vos frais d'abonnement seront traités via la boutique d'applications liée à votre appareil (comme l'App Store d'Apple ou Google Play). Pour vous abonner, vous devez conserver un moyen de paiement valide enregistré auprès de la boutique d'applications. Vous serez facturé à l'avance de manière récurrente, en fonction du forfait d'abonnement que vous choisissez. Votre abonnement se renouvellera automatiquement à la fin de chaque cycle de facturation dans les mêmes conditions, sauf si vous l'annulez ou si Kapps l'annule.
        </Text>
        <Text style={styles.subtitle}>Comment annuler votre abonnement</Text>
        <Text style={styles.body}>
          L'annulation de votre abonnement est possible à tout moment via la boutique d'applications de votre appareil. Une annulation avant la fin du cycle de facturation en cours maintient votre abonnement actif jusqu'à sa conclusion, et vous ne serez pas facturé pour le cycle suivant. Cependant, annuler après le début d'un cycle de facturation signifie que vous n'obtiendrez pas de remboursement pour cette période.
        </Text>
        <Text style={styles.subtitle}>Mettre à niveau votre abonnement</Text>
        <Text style={styles.body}>
          Vous êtes libre de passer à un forfait d'abonnement de niveau supérieur à tout moment. Bien que votre compte soit mis à niveau juste après votre passage au forfait supérieur, la politique pour la période restante dépend du mode de paiement que vous avez utilisé.
        </Text>
        <Text style={styles.body}>
          Apple App Store : Pour mettre à niveau votre forfait, vous devrez d'abord payer le montant total du nouveau forfait. Votre nouvelle période d'abonnement commencera, et vous serez remboursé des frais de l'ancien abonnement pour le reste de la période.
        </Text>
        <Text style={styles.body}>
          Google Play Store : Pour mettre à niveau votre forfait, vous devez d'abord payer pour le nouveau forfait pour le reste de la période d'abonnement. La durée de votre abonnement ne changera pas, et vous serez facturé pour la totalité de la période d'abonnement lors de votre prochain paiement.
        </Text>
        <Text style={styles.subtitle}>Rétrograder votre abonnement</Text>
        <Text style={styles.body}>
          Vous pouvez demander une rétrogradation à tout moment. Votre forfait actuel restera en vigueur pour la durée de votre abonnement en cours, et le forfait que vous avez rétrogradé commencera lors de votre prochaine période d'abonnement. Aucun remboursement ne sera accordé pour les frais déjà payés pour votre période d'abonnement en cours.
        </Text>
        <Text style={styles.subtitle}>Annulation des abonnements</Text>
        <Text style={styles.body}>
          Vous pouvez annuler le renouvellement de votre abonnement via la page des paramètres de Dress&apos;n Party et la boutique d'applications. Aucun remboursement ne sera accordé pour les frais déjà payés pour votre période d'abonnement en cours, et vous conserverez l'accès au Service jusqu'à la fin de cette période.
        </Text>
        <Text style={styles.subtitle}>Modifications des frais d'abonnement</Text>
        <Text style={styles.body}>
          Kapps peut modifier les frais d'abonnement à sa discrétion. Toute modification prendra effet après la fin de la période d'abonnement en cours. Kapps vous informera à l'avance de toute modification des frais via la boutique d'applications où vous avez effectué le paiement, vous donnant la possibilité d'annuler votre abonnement avant que la modification ne prenne effet.
        </Text>
        <Text style={styles.subtitle}>Politique de remboursement</Text>
        <Text style={styles.body}>
          Kapps suit la politique de la boutique d'applications pour les remboursements. Contactez directement la boutique d'applications pour les demandes de remboursement.
        </Text>

        {/* Fonctionnalités d'Intelligence Artificielle (IA) */}
        <Text style={styles.section}>Fonctionnalités d&apos;Intelligence Artificielle (IA)</Text>
        <Text style={styles.subtitle}>Description du service</Text>
        <Text style={styles.body}>
          Dress&apos;n Party peut proposer des fonctionnalités basées sur l'intelligence artificielle (« Fonctionnalités IA »), telles que l'agent de Chat IA pour des conseils de mode et les outils de Traitement d'Image IA (« Embellir », « Détecteur intelligent »). Ces fonctionnalités utilisent des modèles d'IA pour générer des réponses ou traiter du contenu en fonction de vos entrées.
        </Text>
        <Text style={styles.subtitle}>Entrées utilisateur et contenu</Text>
        <Text style={styles.body}>
          Votre utilisation des Fonctionnalités IA peut impliquer la fourniture d'entrées, telles que des messages texte ou des images (« Entrée Utilisateur »). Votre Entrée Utilisateur est considérée comme du Contenu Utilisateur, et votre octroi de droits à Kapps pour l'utilisation de ce Contenu Utilisateur est régi par la Section 3 (« Votre Contenu ») de ces Conditions.
        </Text>
        <Text style={styles.subtitle}>Sortie générée par l'IA</Text>
        <Text style={styles.body}>
          Nature de la sortie : Vous reconnaissez que les sorties générées par les Fonctionnalités IA (par exemple, réponses de chat, images traitées, suggestions) sont générées par un système d'IA. Elles sont fournies à des fins d'information ou de divertissement uniquement.
        </Text>
        <Text style={styles.body}>
          Exclusion de garanties : Les Fonctionnalités IA et leurs sorties sont fournies « en l'état » et « selon la disponibilité ». Kapps décline spécifiquement toute garantie, expresse ou implicite, concernant l'exactitude, l'exhaustivité, la fiabilité, l'adéquation, l'actualité ou la non-contrefaçon des sorties générées par l'IA. Les sorties peuvent contenir des erreurs, des biais ou des inexactitudes.
        </Text>
        <Text style={styles.body}>
          Pas de conseil professionnel : Les sorties des Fonctionnalités IA, y compris le Chat IA, ne constituent pas des conseils professionnels en matière de mode, ni aucun autre type de conseil professionnel (par exemple, juridique, financier). Vous ne devez pas vous fier uniquement aux sorties générées par l'IA pour prendre des décisions. Kapps n'est pas responsable des actions prises sur la base des sorties de l'IA.
        </Text>
        <Text style={styles.subtitle}>Propriété des images générées par l'IA</Text>
        <Text style={styles.body}>
          « Image générée par l'IA » désigne toutes les sorties visuelles générées à partir du Contenu téléchargé par l'Utilisateur grâce à la technologie de l'intelligence artificielle au sein du Service.
        </Text>
        <Text style={styles.body}>
          Tous les droits de propriété intellectuelle, y compris le droit d'auteur, sur les Images générées par l'IA sont exclusivement dévolus à Kapps. Ce que nous fournissons au Membre n'est pas le fichier de l'Image générée par l'IA lui-même, mais un droit d'utilisation limité de cette image au sein de l'Application conformément à ces Conditions.
        </Text>
        <Text style={styles.body}>
          Kapps accorde au Membre une licence pour visualiser et utiliser les Images générées par l'IA au sein du Service uniquement à des fins personnelles et non commerciales. Le partage externe d'Images générées par l'IA est autorisé de manière limitée. Le Membre peut effectuer les actes suivants :
        </Text>
        <Text style={styles.body}>
          Visualiser les Images générées par l'IA au sein du Service.
        </Text>
        <Text style={styles.body}>
          Modifier les Images générées par l'IA à l'aide des fonctionnalités d'édition que nous fournissons au sein du Service (à condition que les droits sur ces images modifiées soient également soumis à cet Article).
        </Text>
        <Text style={styles.body}>
          Créer et enregistrer du contenu utilisant des Images générées par l'IA à l'aide des fonctionnalités que nous fournissons au sein du Service, telles que la création de tenues.
        </Text>
        <Text style={styles.body}>
          Partager avec d'autres Membres au sein du Service à l'aide des fonctionnalités que nous fournissons au sein du Service.
        </Text>
        <Text style={styles.body}>
          Publier ou partager des Images générées par l'IA ou des captures d'écran du Service contenant des Images générées par l'IA en dehors du Service à des fins personnelles et non commerciales.
        </Text>
        <Text style={styles.body}>
          Le Membre ne doit pas effectuer les actes suivants sans l'autorisation de Kapps :
        </Text>
        <Text style={styles.body}>
          Copier, altérer, modifier, éditer ou créer des œuvres dérivées basées sur des Images générées par l'IA en utilisant des méthodes autres que les fonctionnalités fournies au sein du Service.
        </Text>
        <Text style={styles.body}>
          Vendre, louer, ou exploiter commercialement de toute autre manière les Images générées par l'IA ou le contenu les utilisant sous quelque forme que ce soit (y compris toutes les activités à but lucratif directes ou indirectes telles que la publicité, le marketing, la fabrication de produits ou la vente de services).
        </Text>
        <Text style={styles.body}>
          Présenter faussement les Images générées par l'IA comme la création originale du Membre ou d'un tiers, ou déformer de toute autre manière leur origine.
        </Text>
        <Text style={styles.body}>
          Utiliser les Images générées par l'IA pour développer ou fournir des services concurrents de notre activité.
        </Text>
        <Text style={styles.body}>
          Utiliser les Images générées par l'IA en lien avec ou dans le but de tout contenu illégal, portant atteinte aux droits d'autrui, diffamatoire, obscène, violent, discriminatoire, ou autrement contraire à l'ordre public et aux bonnes mœurs, ou autrement inapproprié.
        </Text>
        <Text style={styles.body}>
          Tout autre acte qui enfreint les droits de propriété intellectuelle de Kapps ou interfère avec le fonctionnement normal du Service.
        </Text>
        <Text style={styles.body}>
          Nous pouvons utiliser les Images générées par l'IA à des fins commerciales raisonnables, y compris, mais sans s'y limiter, la fourniture, l'exploitation, la maintenance et l'amélioration du Service, le développement de nouvelles fonctionnalités et services, la formation et l'amélioration des modèles d'IA, l'analyse statistique, le respect des obligations légales, l'application de ces Conditions et le maintien de la sécurité du Service.
        </Text>
        <Text style={styles.body}>
          Le Membre reconnaît que les Images générées par l'IA peuvent ne pas refléter fidèlement les vêtements ou styles réels et doivent être utilisées à la seule discrétion et responsabilité du Membre.
        </Text>
        <Text style={styles.subtitle}>Obligations de l'utilisateur</Text>
        <Text style={styles.body}>
          Lors de l'utilisation des Fonctionnalités IA, en plus de vos obligations en vertu de la Section 11 (« Obligation de l'utilisateur »), vous vous engagez à ne pas :
        </Text>
        <Text style={styles.body}>
          Utiliser les fonctionnalités pour générer ou tenter de générer du contenu illégal, nuisible, harcelant, contrefaisant ou violant de toute autre manière nos politiques de contenu.
        </Text>
        <Text style={styles.body}>
          Tenter de découvrir les algorithmes, modèles ou instructions sous-jacents utilisés par les Fonctionnalités IA.
        </Text>
        <Text style={styles.body}>
          Contourner les filtres de sécurité ou les protections mis en œuvre dans les Fonctionnalités IA.
        </Text>
        <Text style={styles.body}>
          Utiliser des moyens automatisés (par exemple, bots, scripts) pour interagir avec les Fonctionnalités IA d'une manière qui perturbe ou impose une charge déraisonnable sur le Service.
        </Text>
        <Text style={styles.body}>
          Utiliser les fonctionnalités à des fins qui portent atteinte aux droits d'autrui.
        </Text>
        <Text style={styles.body}>
          Pour les Fonctionnalités IA qui peuvent permettre de prévisualiser les résultats avant la finalisation (telles que certaines fonctionnalités de traitement d'image IA), tenter de sauvegarder, copier, faire une capture d'écran, ou capturer ou utiliser de toute autre manière la sortie prévisualisée sans effectuer l'action requise (par exemple, dépenser des Beans comme décrit dans la Section 5) pour obtenir le résultat final autorisé.
        </Text>
        <Text style={styles.body}>
          Limitation de responsabilité : Votre utilisation des Fonctionnalités IA est soumise aux limitations de responsabilité énoncées dans la Section 13 (« Limitation de responsabilité ») de ces Conditions.
        </Text>

        {/* Sécurité */}
        <Text style={styles.section}>Sécurité</Text>
        <Text style={styles.body}>
          Nous nous soucions de la sécurité de nos utilisateurs. Bien que nous travaillions à protéger la sécurité de votre contenu et de votre compte, Dress&apos;n Party ne peut garantir que des tiers non autorisés ne pourront pas déjouer nos mesures de sécurité. Nous vous demandons de garder votre mot de passe en sécurité. Veuillez nous informer immédiatement de toute compromission ou utilisation non autorisée de votre compte.
        </Text>

        {/* Services et Matériels Tiers */}
        <Text style={styles.section}>Services et Matériels Tiers</Text>
        <Text style={styles.body}>
          Dress&apos;n Party peut contenir du contenu de tiers, des sites web, des annonceurs, des services, des offres spéciales, ou d'autres événements ou activités qui ne sont pas détenus ou contrôlés par nous. Nous n'endossons ni n'assumons aucune responsabilité pour de tels sites, informations, matériels, produits ou services de tiers. Si vous accédez à un site web, service ou contenu de tiers depuis Dress&apos;n Party, vous le faites à vos propres risques et vous acceptez que Dress&apos;n Party n'a aucune responsabilité découlant de votre utilisation ou de votre accès à un site web, service ou contenu de tiers. Nous nous réservons le droit de suspendre les Services et contenus de tiers à tout moment.
        </Text>
        <Text style={styles.body}>
          Kapps n'est en aucun cas responsable du contenu publié par des tiers. Bien que nous ayons le droit de le faire, nous n'avons aucune obligation d'examiner ou d'inspecter les matériaux de tiers sur le service. Vous reconnaissez que vous assumez tous les risques associés à l'utilisation, à l'état et à l'exactitude des matériaux de tiers.
        </Text>

        {/* Droits de Propriété Intellectuelle */}
        <Text style={styles.section}>Droits de Propriété Intellectuelle</Text>
        <Text style={styles.body}>
          Tous les matériaux et contenus composant Dress&apos;n Party, y compris mais sans s'y limiter, les images et le contenu écrit, sont protégés par les lois sur la propriété intellectuelle, y compris le droit d'auteur, les brevets, les marques de commerce et autres lois connexes. Les droits de propriété intellectuelle des matériaux et contenus nous appartiennent ou nous avons la permission du propriétaire de les utiliser pour fournir le service. Vous acceptez d'utiliser les matériaux et contenus uniquement pour utiliser le service conformément à ces Conditions d'Utilisation. Leur utilisation à d'autres fins est interdite sauf si vous avez la permission du propriétaire. Les autres noms d'entreprises, de produits et de services et logos utilisés et affichés via le Service peuvent être des marques de commerce ou des marques de service de leurs propriétaires respectifs qui peuvent ou non approuver ou être affiliés ou connectés à Kapps.
        </Text>

        {/* Politique de Contrefaçon */}
        <Text style={styles.section}>Politique de Contrefaçon</Text>
        <Text style={styles.body}>
          Si un contenu disponible dans Dress&apos;n Party enfreint le droit de quelqu'un, toute personne peut nous contacter par e-mail à lesieurkim@gmail.com. Dans l'e-mail, vous pouvez nous fournir les informations ci-dessous.
        </Text>
        <Text style={styles.body}>
          Votre nom et vos coordonnées ;
        </Text>
        <Text style={styles.body}>
          Toute forme de confirmation que vous êtes le propriétaire ou que vous représentez le propriétaire de la propriété intellectuelle ;
        </Text>
        <Text style={styles.body}>
          Une description de votre œuvre, ou d'autres moyens nous permettant d'identifier votre œuvre ;
        </Text>
        <Text style={styles.body}>
          Un lien vers l'œuvre contrefaisante ;
        </Text>
        <Text style={styles.body}>
          Une déclaration selon laquelle vous croyez que l'utilisation de l'œuvre n'est pas autorisée.
        </Text>

        {/* Fonctionnement et Résiliation du Service */}
        <Text style={styles.section}>Fonctionnement et Résiliation du Service</Text>
        <Text style={styles.body}>
          Kapps peut suspendre ou résilier le Service ou votre droit d'accès ou d'utilisation de Dress&apos;n Party pour quelque raison que ce soit, moyennant un préavis approprié. Nous pouvons résilier ou suspendre votre accès immédiatement et sans préavis si nous avons une bonne raison, y compris toute violation de l'obligation de l'utilisateur décrite dans la Section 11 de ces Conditions, des problèmes de maintenance critiques, etc. À la résiliation, vous continuez d'être lié par la Section 3. Si nous suspendons ou résilions votre compte, nous ne serons pas responsables envers vous des dommages ou pertes qui pourraient en résulter.
        </Text>

        {/* Obligation de l'Utilisateur */}
        <Text style={styles.section}>Obligation de l&apos;Utilisateur</Text>
        <Text style={styles.body}>
          Lors de l'utilisation du Service, les utilisateurs doivent suivre les directives ci-dessous :
        </Text>
        <Text style={styles.body}>
          Ne pas publier de contenu illégal, illicite, nuisible, violent, portant atteinte aux droits de tiers, répréhensible, pornographique, diffamatoire, invasif, encourageant le blanchiment d'argent, le jeu ou tout autre comportement illégal ou injustifié.
        </Text>
        <Text style={styles.body}>
          Ne pas violer de loi, de réglementation ou toute autre restriction applicable à l'utilisation du service.
        </Text>
        <Text style={styles.body}>
          Ne pas traquer, harceler, intimider, usurper l'identité ou solliciter des informations de quiconque, en particulier des personnes de moins de 18 ans.
        </Text>
        <Text style={styles.body}>
          Ne pas usurper l'identité d'une personne ou d'une organisation.
        </Text>
        <Text style={styles.body}>
          Ne pas enfreindre la propriété intellectuelle, la vie privée ou d'autres droits de quiconque.
        </Text>
        <Text style={styles.body}>
          Ne pas accéder, utiliser ou manipuler nos systèmes ou les systèmes de nos fournisseurs techniques.
        </Text>
        <Text style={styles.body}>
          Ne pas briser ou contourner nos mesures de sécurité ou tester la vulnérabilité de nos systèmes ou réseaux.
        </Text>
        <Text style={styles.body}>
          Ne pas essayer d'interférer avec les personnes sur Dress&apos;n Party ou nos hôtes ou réseaux, comme l'envoi d'un virus, la surcharge, le spamming ou le mail-bombing.
        </Text>
        <Text style={styles.body}>
          Ne pas collecter ou stocker des informations personnellement identifiables de Dress&apos;n Party ou de personnes sur Dress&apos;n Party sans permission.
        </Text>
        <Text style={styles.body}>
          Ne pas vendre ou transmettre quoi que ce soit que vous n'avez pas le droit de vendre ou de transmettre en vertu de la loi ou d'une relation existante.
        </Text>
        <Text style={styles.body}>
          Ne pas utiliser les informations ou le compte d'un tiers pour le paiement, sauf si vous avez leur permission expresse de le faire.
        </Text>
        <Text style={styles.body}>
          Ne pas partager votre mot de passe, laisser quiconque accéder à votre compte ou faire quoi que ce soit qui pourrait mettre votre compte en danger.
        </Text>
        <Text style={styles.body}>
          Ne pas tenter d'acheter ou de vendre l'accès à votre compte, à vos tableaux ou à vos noms d'utilisateur, ou de transférer de toute autre manière les fonctionnalités du compte contre une compensation.
        </Text>
        <Text style={styles.body}>
          Ne pas publier d'informations privées ou confidentielles via le Service, y compris, mais sans s'y limiter, les informations de votre carte de crédit ou de celle de toute autre personne, les numéros de sécurité sociale ou d'identité nationale alternatifs, les numéros de téléphone non publics ou les adresses e-mail non publiques.
        </Text>
        <Text style={styles.body}>
          Ne pas interférer ou manipuler de manière injuste ou illégale un système de notation ou un système de feedback des utilisateurs.
        </Text>
        <Text style={styles.body}>
          Ne pas donner d'informations fausses ou trompeuses dans les détails de votre Compte.
        </Text>
        <Text style={styles.body}>
          Ne pas permettre à une autre personne d'utiliser le Service sous votre nom ou en votre nom, sauf si vous êtes une entreprise et que cette personne est autorisée par vous.
        </Text>
        <Text style={styles.body}>
          Ne pas utiliser le Service si nous vous avons suspendu ou banni de son utilisation.
        </Text>
        <Text style={styles.body}>
          Ne prendre aucune action ou inaction que Kapps, à son seul jugement, estime discutable ou susceptible de causer un préjudice ou une responsabilité.
        </Text>

        {/* Exclusions de Garantie */}
        <Text style={styles.section}>Exclusions de Garantie</Text>
        <Text style={styles.body}>
          Notre Service et tout le contenu sur Dress&apos;n Party sont fournis « en l'état » sans garantie d'aucune sorte, qu'elle soit expresse ou implicite. Kapps décline spécifiquement toute garantie et condition de qualité marchande, d'adéquation à un usage particulier et de non-contrefaçon, ainsi que toute garantie découlant du cours des affaires ou de l'usage du commerce. Kapps n'assume aucune responsabilité pour tout Contenu Utilisateur que vous ou toute autre personne ou tiers publiez ou envoyez via notre Service. Vous comprenez et acceptez que vous puissiez être exposé à un Contenu Utilisateur inexact, répréhensible, inapproprié pour les enfants ou autrement inadapté à votre objectif.
        </Text>

        {/* Limitation de Responsabilité */}
        <Text style={styles.section}>Limitation de Responsabilité</Text>
        <Text style={styles.body}>
          Vous êtes seul responsable de vos interactions avec les autres utilisateurs, y compris toute transaction d'achat ou de vente. Vous acceptez que Kapps n'aura aucune responsabilité à l'égard de ces interactions, achats ou ventes. Kapps se réserve le droit, mais n'est nullement obligé, de s'impliquer dans tout litige entre vous et un autre utilisateur.
        </Text>
        <Text style={styles.body}>
          DANS LA MESURE MAXIMALE AUTORISÉE PAR LA LOI, KAPPS NE SERA PAS RESPONSABLE DES DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX, CONSÉCUTIFS OU PUNITIFS, NI DE TOUTE PERTE DE PROFITS OU DE REVENUS, QU'ELLE SOIT ENCOURUE DIRECTEMENT OU INDIRECTEMENT, NI DE TOUTE PERTE DE DONNÉES, D'UTILISATION, DE CLIENTÈLE OU D'AUTRES PERTES INCORPORELLES, RÉSULTANT DE (A) VOTRE ACCÈS OU UTILISATION OU INCAPACITÉ D'ACCÉDER OU D'UTILISER LE SERVICE ; (B) TOUTE CONDUITE OU CONTENU D'UN TIERS SUR LE SERVICE, Y COMPRIS, SANS LIMITATION, TOUTE CONDUITE DIFFAMATOIRE, OFFENSANTE OU ILLÉGALE D'AUTRES UTILISATEURS OU TIERS ; OU (C) L'ACCÈS, L'UTILISATION OU L'ALTÉRATION NON AUTORISÉS DE VOS TRANSMISSIONS OU CONTENUS. EN AUCUN CAS, LA RESPONSABILITÉ GLOBALE DE KAPPS POUR TOUTES LES RÉCLAMATIONS RELATIVES AU SERVICE NE DÉPASSERA DIX MILLE WONS SUD-CORÉENS (10 000 KRW).
        </Text>
        <Text style={styles.body}>
          Dress&apos;n Party n'est pas responsable des dommages résultant d'une violation non matérielle de tout autre devoir de diligence applicable. Cette limitation de responsabilité ne s'appliquera pas à toute responsabilité légale qui ne peut être limitée, à la responsabilité pour décès ou dommages corporels causés par notre négligence ou notre faute intentionnelle, ou si et pour exclure notre responsabilité pour quelque chose que nous vous avons spécifiquement promis.
        </Text>

        {/* Droit Applicable et Juridiction */}
        <Text style={styles.section}>Droit Applicable et Juridiction</Text>
        <Text style={styles.body}>
          Ces Conditions seront régies par les lois françaises, sans égard à ses principes de conflit de lois. Ces Conditions d'Utilisation n'excluent aucun droit légal obligatoire que vous pourriez avoir ou obligation que nous pourrions avoir dans votre pays de résidence, où nous ne sommes pas autorisés à les exclure en vertu de la loi. Nous pouvons céder l'un de nos droits et obligations en vertu de ces Conditions d'Utilisation. Ces Conditions d'Utilisation ne créent pas de relation d'agence, de partenariat, d'emploi ou de coentreprise entre vous et Kapps. Nous ne serons pas responsables de tout retard dans l'exécution ou de l'inexécution de nos obligations causé par un événement de force majeure. Dans ces circonstances, Kapps se verra accorder une prolongation de délai raisonnable pour l'exécution de ses obligations, le caractère raisonnable de cette prolongation devant être évalué dans le contexte de ces Conditions d'Utilisation et des autres engagements de Kapps. Aucun tiers (sauf, le cas échéant, le cessionnaire autorisé de Kapps) n'a droit au bénéfice de ces Conditions d'Utilisation.
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
