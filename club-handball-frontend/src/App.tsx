import { Route, Routes } from "react-router";

import ScrollToTop from "./components/scrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";

import ClubHistoryPage from "./pages/HistoireClub";
import OrganizationChartPage from "./pages/OrganigrammeClub";
import PraticalInfoPage from "./pages/PraticalInfoPage";
import RedArmyVolunteersPage from "./pages/RedArmyBenevoles";

import PublicRosterPage from "./pages/PublicRosterPage";
import CalendrierResultatsPage from "./pages/CalendrierResultats";
import TeamDetailPage from "./pages/TeamdetailPage";

import NewsPage from "./pages/Newspage";
import NewsDetailPage from "./pages/NewsDetailPage";
import TicketingPage from "./pages/TicketingPage";
import PartnersPage from "./pages/Partnerspage";
import Contact from "./pages/contact";

import MemberSpace from "./pages/member/MemberSpasce";
import MyConvocationsPage from "./pages/member/MyConvocationPage";

import CoachDashboard from "./pages/coach/CoachDashboard";
import CoachTeamsPage from "./pages/coach/CoachTeamsPage";

import AdminLayout from "./pages/admin/adminLayout";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminClubInfo from "./pages/admin/AdminClubInfo";
import AdminOrganization from "./pages/admin/AdminOrganization";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminContactMessages from "./pages/admin/AdminContactMessage";

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* Accueil */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activation-compte" element={<ActivateAccountPage />} />

        {/* Club */}
        <Route path="/club/histoire" element={<ClubHistoryPage />} />
        <Route path="/club/organigramme" element={<OrganizationChartPage />} />
        <Route
          path="/club/informations-pratiques"
          element={<PraticalInfoPage />}
        />
        <Route
          path="/club/red-army-benevoles"
          element={<RedArmyVolunteersPage />}
        />

        {/* Équipes premières */}
        <Route
          path="/n3-masculine/effectif"
          element={<PublicRosterPage teamSlug="nationale-3-masculine" />}
        />

        <Route
          path="/n3-feminine/effectif"
          element={<PublicRosterPage teamSlug="nationale-3-feminine" />}
        />

        <Route
          path="/n3-masculine/calendrier-resultats"
          element={<CalendrierResultatsPage team="masculin" />}
        />

        <Route
          path="/n3-feminine/calendrier-resultats"
          element={<CalendrierResultatsPage team="feminin" />}
        />

        {/* Autres équipes */}
        <Route path="/equipes/:teamSlug" element={<TeamDetailPage />} />

        {/* Pages publiques */}
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:slug" element={<NewsDetailPage />} />
        <Route path="/billetterie" element={<TicketingPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Espace membre */}
        <Route
          path="/espace-membre"
          element={
            <ProtectedRoute allowedRoles={["joueur", "coach", "admin"]}>
              <MemberSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espace-membre/convocations"
          element={
            <ProtectedRoute allowedRoles={["joueur", "coach", "admin"]}>
              <MyConvocationsPage />
            </ProtectedRoute>
          }
        />

        {/* Espace coach */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach", "admin"]}>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coach/equipes"
          element={
            <ProtectedRoute allowedRoles={["coach", "admin"]}>
              <CoachTeamsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="actualites" element={<AdminNews />} />
          <Route path="equipes" element={<AdminTeams />} />
          <Route path="joueurs" element={<AdminPlayers />} />
          <Route path="matchs" element={<AdminMatches />} />
          <Route path="partenaires" element={<AdminPartners />} />
          <Route path="infos-club" element={<AdminClubInfo />} />
          <Route path="organigramme" element={<AdminOrganization />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="evenements" element={<AdminEvents />} />
          <Route path="contact-messages" element={<AdminContactMessages />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <main className="min-h-screen bg-white px-8 py-24 text-black">
              <div className="mx-auto max-w-7xl">
                <h1 className="text-4xl font-black uppercase">
                  Page introuvable
                </h1>

                <p className="mt-4 text-zinc-600">
                  La page demandée n’existe pas ou le lien est incorrect.
                </p>
              </div>
            </main>
          }
        />
      </Routes>

      <Newsletter />

      <Footer />
    </>
  );
}

export default App;