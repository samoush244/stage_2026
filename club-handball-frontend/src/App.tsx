import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MensN3RosterPage from "./pages/MensN3RosterPage";
import WomensN3RosterPage from "./pages/WomensN3RosterPage";
import ClubHistoryPage from "./pages/HistoireClub";
import OrganizationChartPage from "./pages/OrganigrammeClub";
import PraticalInfoPage from "./pages/PraticalInfoPage";
import RedArmyVolunteersPage from "./pages/RedArmyBenevoles";
import TeamDetailPage from "./pages/TeamdetailPage";
import NewsPage from "./pages/Newspage";
import NewsDetailPage from "./pages/NewsDetailPage";
import TicketingPage from "./pages/TicketingPage";
import PartnersPage from "./pages/Partnerspage";
import Contact from "./pages/contact";
import CalendrierResultatsPage from "./pages/CalendrierResultats";
import ScrollToTop from "./components/scrollToTop";

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
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminContactMessages from "./pages/admin/AdminContactMessage";
function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/club/histoire" element={<ClubHistoryPage />} />
        <Route path="/club/organigramme" element={<OrganizationChartPage />} />
        <Route path="/club/informations-pratiques" element={<PraticalInfoPage />} />
        <Route path="/club/red-army-benevoles" element={<RedArmyVolunteersPage />} />
        <Route path="/n3-masculine/effectif" element={<MensN3RosterPage />} />
        <Route path="/n3-feminine/effectif" element={<WomensN3RosterPage />} />
        <Route path="/n3-masculine/calendrier-resultats" element={<CalendrierResultatsPage team="masculin" />} />
        <Route path="/n3-feminine/calendrier-resultats" element={<CalendrierResultatsPage team="feminin" />} />
        <Route path="/equipes/:teamSlug" element={<TeamDetailPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:newsSlug" element={<NewsDetailPage />} />
        <Route path="/billetterie" element={<TicketingPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/contact" element={<Contact />} />
          <Route element={<ProtectedAdminRoute />}></Route>
  <Route path="/admin" element={<AdminLayout />}>
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
      </Routes>
      <Footer />
    </>
    
  );
}

export default App;