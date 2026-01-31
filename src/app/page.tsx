"use client";

import { useState, useMemo } from "react";

import {
  LayoutDashboard,
  Calendar,
  Building2,
  Wallet,
  CalendarDays,
  Euro,
  Landmark,
  ChevronRight,
} from "lucide-react";

/**
 * Extrait le montant numérique d'un prix formaté.
 * @param prix - Chaîne formatée (ex: "€ 75", "€ 60.50")
 * @returns Le montant en nombre (0 si invalide)
 */
const parsePrix = (prix: string): number =>
  parseFloat(prix.replace(/[^\d.]/g, "")) || 0;

/** Données initiales des séances (valeur de départ pour l'état) */
const donneesInitialesSeances = [
  {
    id: 1,
    nomCliente: "Sophie Martin",
    institut: "Spa Zen Paris",
    prix: "€ 75",
    etat: "Payé" as const,
  },
  {
    id: 2,
    nomCliente: "Marie Dupont",
    institut: "Institut Beauté Lyon",
    prix: "€ 60",
    etat: "À payer" as const,
  },
  {
    id: 3,
    nomCliente: "Julie Bernard",
    institut: "Spa Zen Paris",
    prix: "€ 75",
    etat: "Payé" as const,
  },
  {
    id: 4,
    nomCliente: "Claire Petit",
    institut: "Wellness Center",
    prix: "€ 90",
    etat: "À payer" as const,
  },
  {
    id: 5,
    nomCliente: "Anne Laurent",
    institut: "Institut Beauté Lyon",
    prix: "€ 60",
    etat: "Payé" as const,
  },
];

/** Configuration des cartes de statistiques (titres, icônes, styles) */
const statsConfig = [
  {
    titre: "Massages du jour",
    icone: CalendarDays,
    couleur: "text-blue-600",
    fond: "bg-blue-50",
  },
  {
    titre: "Gains Mirella 70%",
    icone: Euro,
    couleur: "text-emerald-600",
    fond: "bg-emerald-50",
  },
  {
    titre: "Commissions Instituts",
    icone: Landmark,
    couleur: "text-violet-600",
    fond: "bg-violet-50",
  },
];

/** Items de navigation de la sidebar */
const navItems = [
  { label: "Tableau de Bord", icon: LayoutDashboard, active: true },
  { label: "Planning", icon: Calendar, active: false },
  { label: "Instituts", icon: Building2, active: false },
  { label: "Revenus", icon: Wallet, active: false },
];

export default function DashboardZenFlow() {
  const [dernieresSeances, setDernieresSeances] = useState(
    donneesInitialesSeances
  );

  /**
   * Statistiques calculées dynamiquement à partir des séances.
   * useMemo évite de recalculer à chaque rendu (seulement quand dernieresSeances change).
   *
   * .reduce() : réduit un tableau à une seule valeur en accumulant.
   * Syntaxe : array.reduce((accumulateur, élément) => nouvelleValeur, valeurInitiale)
   * - accumulateur : résultat accumulé à chaque itération
   * - élément : l'élément courant du tableau
   * - valeurInitiale : point de départ (0 pour une somme, [] pour un tableau)
   */
  const statsCalculees = useMemo(() => {
    // 1. Nombre de massages = longueur du tableau (reduce pour démontrer l'usage)
    const massagesDuJour = dernieresSeances.reduce((acc) => acc + 1, 0);

    // 2. Total des séances payées (reduce : somme des prix des séances "Payé")
    const totalPaye = dernieresSeances.reduce(
      (acc, seance) =>
        seance.etat === "Payé" ? acc + parsePrix(seance.prix) : acc,
      0
    );

    // 3. Répartition : 70% Mirella, 30% instituts (sur séances payées uniquement)
    const gainsMirella = Math.round(totalPaye * 0.7);
    const commissionsInstituts = Math.round(totalPaye * 0.3);

    // Fusion config + valeurs calculées pour l'affichage
    return statsConfig.map((config, index) => {
      const valeurs = [
        massagesDuJour,
        `€ ${gainsMirella}`,
        `€ ${commissionsInstituts}`,
      ];
      return { ...config, valeur: String(valeurs[index]) };
    });
  }, [dernieresSeances]);

  /** Bascule l'état de paiement d'une séance (Payé ↔ À payer) */
  function togglePayment(id: number) {
    setDernieresSeances((prev) =>
      prev.map((seance) =>
        seance.id === id
          ? { ...seance, etat: seance.etat === "Payé" ? "À payer" : "Payé" }
          : seance
      )
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">ZenFlow</h1>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors duration-200
                  ${
                    item.active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.active && <ChevronRight size={16} className="ml-auto" />}
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-medium text-gray-800">
            Bonjour Mirella, prête pour vos séances aujourd&apos;hui ?
          </h2>
          <p className="text-gray-500 mt-1">Voici un aperçu de votre journée</p>
        </div>

        {/* Cartes de statistiques (valeurs calculées dynamiquement) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCalculees.map((stat) => {
            const IconComponent = stat.icone;
            return (
              <div
                key={stat.titre}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {stat.titre}
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.valeur}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.fond}`}>
                    <IconComponent className={stat.couleur} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tableau des dernières séances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Dernières Séances
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Vos rendez-vous récents
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Nom cliente
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Institut
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    Prix
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                    État
                  </th>
                </tr>
              </thead>
              <tbody>
                {dernieresSeances.map((seance) => (
                  <tr
                    key={seance.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {seance.nomCliente}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {seance.institut}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{seance.prix}</td>
                    <td className="py-4 px-6">
                      {/* Badge cliquable pour basculer l'état de paiement */}
                      <span
                        onClick={() => togglePayment(seance.id)}
                        className={`
                          inline-flex px-3 py-1 rounded-full text-xs font-medium
                          cursor-pointer select-none
                          hover:opacity-80 transition-opacity
                          ${
                            seance.etat === "Payé"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }
                        `}
                      >
                        {seance.etat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
