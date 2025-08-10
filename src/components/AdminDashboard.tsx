import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Settings, 
  Users, 
  MessageSquare, 
  Briefcase, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GraduationCap,
  HelpCircle,
  Building2,
  Star,
  Calendar,
  Image
} from 'lucide-react';

interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image_path: string;
  features: string;
  price: string;
  sort_order: number;
}

interface Formation {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  duration: string;
  participants: string;
  price: string;
  features: string;
  image_path: string;
  badge: string;
  sort_order: number;
}

interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  speciality: string;
  image_path: string;
  experience: string;
  description: string;
  certifications: string;
  achievements: string;
  social_instagram: string;
  social_linkedin: string;
  social_email: string;
  sort_order: number;
}

interface Testimonial {
  id: number;
  slug: string;
  name: string;
  role: string;
  image_path: string;
  rating: number;
  text: string;
  service: string;
  sort_order: number;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: number;
}

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GalleryItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  service_id: number | null;
  images: string[];
  featured_image: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface SiteSettings {
  id: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
  business_hours: string;
}

const AdminDashboard: React.FC = () => {
  // State for all sections
  const [services, setServices] = useState<Service[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  
  // Editing states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [isCreatingFormation, setIsCreatingFormation] = useState(false);
  const [isCreatingTeamMember, setIsCreatingTeamMember] = useState(false);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);
  const [isCreatingGalleryItem, setIsCreatingGalleryItem] = useState(false);

  // Form states
  const [serviceFormData, setServiceFormData] = useState({
    slug: '', title: '', description: '', icon_name: '', image_path: '', features: [], price: '', sort_order: 0
  });
  
  const [formationFormData, setFormationFormData] = useState({
    slug: '', title: '', subtitle: '', description: '', level: '', duration: '', participants: '', price: '', features: [], image_path: '', badge: '', sort_order: 0
  });
  
  const [teamMemberFormData, setTeamMemberFormData] = useState({
    slug: '', name: '', role: '', speciality: '', image_path: '', experience: '', description: '', certifications: '', achievements: '', social_instagram: '', social_linkedin: '', social_email: '', sort_order: 0
  });
  
  const [testimonialFormData, setTestimonialFormData] = useState({
    slug: '', name: '', role: '', image_path: '', rating: 5, text: '', service: '', sort_order: 0
  });
  
  const [faqFormData, setFaqFormData] = useState({
    question: '', answer: '', category: 'general', sort_order: 0, is_active: 1
  });
  
  const [settingsFormData, setSettingsFormData] = useState({
    site_name: '', site_description: '', contact_email: '', contact_phone: '', contact_address: '', social_instagram: '', social_facebook: '', social_tiktok: '', business_hours: ''
  });
  
  const [galleryFormData, setGalleryFormData] = useState({
    slug: '', title: '', description: '', category: 'Mariage', service_id: null, images: [''], featured_image: '', is_featured: false, sort_order: 0
  });

  // Feature input helpers
  const [currentServiceFeature, setCurrentServiceFeature] = useState('');
  const [currentFormationFeature, setCurrentFormationFeature] = useState('');
  const [currentGalleryImage, setCurrentGalleryImage] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadServices(),
        loadFormations(),
        loadTeamMembers(),
        loadTestimonials(),
        loadFaqs(),
        loadReservations(),
        loadGalleryItems(),
        loadSiteSettings()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    }
  };

  const loadFormations = async () => {
    try {
      const response = await fetch('/api/admin/formations');
      if (response.ok) {
        const data = await response.json();
        setFormations(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error);
    }
  };

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    }
  };

  const loadFaqs = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des FAQs:', error);
    }
  };

  const loadReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    }
  };

  const loadSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data);
        setSettingsFormData(data || {});
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const loadGalleryItems = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      if (response.ok) {
        const result = await response.json();
        setGalleryItems(result.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la galerie:', error);
    }
  };

  // Feature management helpers
  const addServiceFeature = () => {
    if (currentServiceFeature.trim()) {
      setServiceFormData(prev => ({
        ...prev,
        features: [...prev.features, currentServiceFeature.trim()]
      }));
      setCurrentServiceFeature('');
    }
  };

  const removeServiceFeature = (index: number) => {
    setServiceFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addFormationFeature = () => {
    if (currentFormationFeature.trim()) {
      setFormationFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFormationFeature.trim()]
      }));
      setCurrentFormationFeature('');
    }
  };

  const removeFormationFeature = (index: number) => {
    setFormationFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Form reset helpers
  const resetServiceForm = () => {
    setServiceFormData({
      slug: '', title: '', description: '', icon_name: '', image_path: '', features: [], price: '', sort_order: services.length + 1
    });
    setCurrentServiceFeature('');
  };

  const resetFormationForm = () => {
    setFormationFormData({
      slug: '', title: '', subtitle: '', description: '', level: '', duration: '', participants: '', price: '', features: [], image_path: '', badge: '', sort_order: formations.length + 1
    });
    setCurrentFormationFeature('');
  };

  const resetTeamMemberForm = () => {
    setTeamMemberFormData({
      slug: '', name: '', role: '', speciality: '', image_path: '', experience: '', description: '', certifications: '', achievements: '', social_instagram: '', social_linkedin: '', social_email: '', sort_order: teamMembers.length + 1
    });
  };

  const resetTestimonialForm = () => {
    setTestimonialFormData({
      slug: '', name: '', role: '', image_path: '', rating: 5, text: '', service: '', sort_order: testimonials.length + 1
    });
  };

  const resetFaqForm = () => {
    setFaqFormData({
      question: '', answer: '', category: 'general', sort_order: faqs.length + 1, is_active: 1
    });
  };

  // Gallery helpers
  const addGalleryImage = () => {
    if (currentGalleryImage.trim()) {
      setGalleryFormData(prev => ({
        ...prev,
        images: [...prev.images, currentGalleryImage.trim()]
      }));
      setCurrentGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetGalleryForm = () => {
    setGalleryFormData({
      slug: '', title: '', description: '', category: 'Mariage', service_id: null, images: [''], featured_image: '', is_featured: false, sort_order: galleryItems.length + 1
    });
    setCurrentGalleryImage('');
  };

  // Service CRUD operations
  const startEditingService = (service: Service) => {
    setEditingService(service);
    const features = service.features ? JSON.parse(service.features) : [];
    setServiceFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      image_path: service.image_path,
      features: features,
      price: service.price,
      sort_order: service.sort_order
    });
  };

  const startCreatingService = () => {
    setIsCreatingService(true);
    resetServiceForm();
  };

  const cancelServiceEdit = () => {
    setEditingService(null);
    setIsCreatingService(false);
    resetServiceForm();
  };

  const saveService = async () => {
    try {
      let response;
      const payload = {
        ...serviceFormData,
        features: serviceFormData.features
      };

      if (editingService) {
        response = await fetch('/api/admin/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingService.id })
        });
      } else {
        response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadServices();
        cancelServiceEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadServices();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Formation CRUD operations
  const startEditingFormation = (formation: Formation) => {
    setEditingFormation(formation);
    const features = formation.features ? JSON.parse(formation.features) : [];
    setFormationFormData({
      slug: formation.slug,
      title: formation.title,
      subtitle: formation.subtitle,
      description: formation.description,
      level: formation.level,
      duration: formation.duration,
      participants: formation.participants,
      price: formation.price,
      features: features,
      image_path: formation.image_path,
      badge: formation.badge,
      sort_order: formation.sort_order
    });
  };

  const startCreatingFormation = () => {
    setIsCreatingFormation(true);
    resetFormationForm();
  };

  const cancelFormationEdit = () => {
    setEditingFormation(null);
    setIsCreatingFormation(false);
    resetFormationForm();
  };

  const saveFormation = async () => {
    try {
      let response;
      const payload = {
        ...formationFormData,
        features: formationFormData.features
      };

      if (editingFormation) {
        response = await fetch('/api/admin/formations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingFormation.id })
        });
      } else {
        response = await fetch('/api/admin/formations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadFormations();
        cancelFormationEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteFormation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      const response = await fetch(`/api/admin/formations?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadFormations();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Team CRUD operations
  const startEditingTeamMember = (teamMember: TeamMember) => {
    setEditingTeamMember(teamMember);
    setTeamMemberFormData({
      slug: teamMember.slug,
      name: teamMember.name,
      role: teamMember.role,
      speciality: teamMember.speciality,
      image_path: teamMember.image_path,
      experience: teamMember.experience,
      description: teamMember.description,
      certifications: teamMember.certifications,
      achievements: teamMember.achievements,
      social_instagram: teamMember.social_instagram,
      social_linkedin: teamMember.social_linkedin,
      social_email: teamMember.social_email,
      sort_order: teamMember.sort_order
    });
  };

  const startCreatingTeamMember = () => {
    setIsCreatingTeamMember(true);
    resetTeamMemberForm();
  };

  const cancelTeamMemberEdit = () => {
    setEditingTeamMember(null);
    setIsCreatingTeamMember(false);
    resetTeamMemberForm();
  };

  const saveTeamMember = async () => {
    try {
      let response;
      const payload = teamMemberFormData;

      if (editingTeamMember) {
        response = await fetch('/api/admin/team', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingTeamMember.id })
        });
      } else {
        response = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadTeamMembers();
        cancelTeamMemberEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteTeamMember = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;

    try {
      const response = await fetch(`/api/admin/team?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTeamMembers();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Testimonial CRUD operations
  const startEditingTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialFormData({
      slug: testimonial.slug,
      name: testimonial.name,
      role: testimonial.role,
      image_path: testimonial.image_path,
      rating: testimonial.rating,
      text: testimonial.text,
      service: testimonial.service,
      sort_order: testimonial.sort_order
    });
  };

  const startCreatingTestimonial = () => {
    setIsCreatingTestimonial(true);
    resetTestimonialForm();
  };

  const cancelTestimonialEdit = () => {
    setEditingTestimonial(null);
    setIsCreatingTestimonial(false);
    resetTestimonialForm();
  };

  const saveTestimonial = async () => {
    try {
      let response;
      const payload = testimonialFormData;

      if (editingTestimonial) {
        response = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingTestimonial.id })
        });
      } else {
        response = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadTestimonials();
        cancelTestimonialEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTestimonials();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // FAQ CRUD operations
  const startEditingFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_active: faq.is_active
    });
  };

  const startCreatingFaq = () => {
    setIsCreatingFaq(true);
    resetFaqForm();
  };

  const cancelFaqEdit = () => {
    setEditingFaq(null);
    setIsCreatingFaq(false);
    resetFaqForm();
  };

  const saveFaq = async () => {
    try {
      let response;
      const payload = faqFormData;

      if (editingFaq) {
        response = await fetch('/api/admin/faqs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingFaq.id })
        });
      } else {
        response = await fetch('/api/admin/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadFaqs();
        cancelFaqEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) return;

    try {
      const response = await fetch(`/api/admin/faqs?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadFaqs();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Reservation management operations
  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      const reservation = reservations.find(r => r.id === id);
      if (!reservation) return;

      const response = await fetch('/api/admin/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reservation, status: newStatus })
      });

      if (response.ok) {
        await loadReservations();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const deleteReservation = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      const response = await fetch(`/api/admin/reservations?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadReservations();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Site Settings operations
  const saveSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsFormData)
      });

      if (response.ok) {
        await loadSiteSettings();
        alert('Paramètres mis à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Gallery CRUD operations
  const startEditingGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
      slug: item.slug,
      title: item.title,
      description: item.description,
      category: item.category,
      service_id: item.service_id,
      images: item.images,
      featured_image: item.featured_image,
      is_featured: item.is_featured,
      sort_order: item.sort_order
    });
  };

  const startCreatingGalleryItem = () => {
    setIsCreatingGalleryItem(true);
    resetGalleryForm();
  };

  const cancelGalleryItemEdit = () => {
    setEditingGalleryItem(null);
    setIsCreatingGalleryItem(false);
    resetGalleryForm();
  };

  const saveGalleryItem = async () => {
    try {
      let response;
      const payload = {
        ...galleryFormData,
        images: galleryFormData.images.filter(img => img.trim() !== '')
      };

      if (editingGalleryItem) {
        response = await fetch('/api/admin/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingGalleryItem.id, ...payload })
        });
      } else {
        response = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        await loadGalleryItems();
        cancelGalleryItemEdit();
        alert(editingGalleryItem ? 'Élément mis à jour avec succès !' : 'Élément créé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const deleteGalleryItem = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément de la galerie ?')) return;

    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadGalleryItems();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.href = '/admin';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard d'Administration
            </h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="formations" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formations
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Témoignages
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Galerie
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des Services</CardTitle>
                  <Button onClick={startCreatingService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingService || isCreatingService) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingService ? 'Modifier le service' : 'Nouveau service'}
                      </h3>
                      <Button onClick={cancelServiceEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service-slug">Slug</Label>
                        <Input
                          id="service-slug"
                          value={serviceFormData.slug}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="service-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-title">Titre</Label>
                        <Input
                          id="service-title"
                          value={serviceFormData.title}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Nom du service"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="service-description">Description</Label>
                        <Textarea
                          id="service-description"
                          value={serviceFormData.description}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description du service"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-icon">Icône</Label>
                        <Input
                          id="service-icon"
                          value={serviceFormData.icon_name}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                          placeholder="Palette, Crown, Sparkles..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-image">Image</Label>
                        <Input
                          id="service-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // For now, just set a placeholder path
                              setServiceFormData(prev => ({ ...prev, image_path: `/images/services/${file.name}` }));
                            }
                          }}
                        />
                        {serviceFormData.image_path && (
                          <p className="text-sm text-gray-500 mt-1">{serviceFormData.image_path}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="service-price">Prix</Label>
                        <Input
                          id="service-price"
                          value={serviceFormData.price}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="À partir de 50€"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-sort">Ordre d'affichage</Label>
                        <Input
                          id="service-sort"
                          type="number"
                          value={serviceFormData.sort_order}
                          onChange={(e) => setServiceFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                      </div>
                      
                      {/* Features Management */}
                      <div className="md:col-span-2">
                        <Label>Caractéristiques</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={currentServiceFeature}
                              onChange={(e) => setCurrentServiceFeature(e.target.value)}
                              placeholder="Nouvelle caractéristique"
                              onKeyPress={(e) => e.key === 'Enter' && addServiceFeature()}
                            />
                            <Button type="button" onClick={addServiceFeature}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {serviceFormData.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {feature}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeServiceFeature(index)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveService}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{service.title}</h3>
                            <Badge variant="secondary">{service.sort_order}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{service.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500 mb-2">
                            <span>Slug: {service.slug}</span>
                            <span>Prix: {service.price}</span>
                            <span>Icône: {service.icon_name}</span>
                          </div>
                          {service.features && (
                            <div className="flex flex-wrap gap-1">
                              {JSON.parse(service.features).map((feature: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditingService(service)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteService(service.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formations Tab */}
          <TabsContent value="formations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des Formations</CardTitle>
                  <Button onClick={startCreatingFormation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Formation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingFormation || isCreatingFormation) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
                      </h3>
                      <Button onClick={cancelFormationEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="formation-slug">Slug</Label>
                        <Input
                          id="formation-slug"
                          value={formationFormData.slug}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="formation-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-title">Titre</Label>
                        <Input
                          id="formation-title"
                          value={formationFormData.title}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Nom de la formation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-subtitle">Sous-titre</Label>
                        <Input
                          id="formation-subtitle"
                          value={formationFormData.subtitle}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Sous-titre de la formation"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-level">Niveau</Label>
                        <Input
                          id="formation-level"
                          value={formationFormData.level}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, level: e.target.value }))}
                          placeholder="Débutant, Intermédiaire, Professionnel"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-duration">Durée</Label>
                        <Input
                          id="formation-duration"
                          value={formationFormData.duration}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="3 heures, 1 jour..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-participants">Participants</Label>
                        <Input
                          id="formation-participants"
                          value={formationFormData.participants}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, participants: e.target.value }))}
                          placeholder="1-3 personnes"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-price">Prix</Label>
                        <Input
                          id="formation-price"
                          value={formationFormData.price}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="120€"
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-badge">Badge</Label>
                        <Input
                          id="formation-badge"
                          value={formationFormData.badge}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="Populaire, Nouveau, Certifiante..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="formation-description">Description</Label>
                        <Textarea
                          id="formation-description"
                          value={formationFormData.description}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de la formation"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-image">Image</Label>
                        <Input
                          id="formation-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormationFormData(prev => ({ ...prev, image_path: `/images/formations/${file.name}` }));
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="formation-sort">Ordre d'affichage</Label>
                        <Input
                          id="formation-sort"
                          type="number"
                          value={formationFormData.sort_order}
                          onChange={(e) => setFormationFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                      </div>
                      
                      {/* Formation Features Management */}
                      <div className="md:col-span-2">
                        <Label>Programme / Caractéristiques</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={currentFormationFeature}
                              onChange={(e) => setCurrentFormationFeature(e.target.value)}
                              placeholder="Nouvel élément du programme"
                              onKeyPress={(e) => e.key === 'Enter' && addFormationFeature()}
                            />
                            <Button type="button" onClick={addFormationFeature}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formationFormData.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {feature}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={() => removeFormationFeature(index)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveFormation}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {formations.map((formation) => (
                    <div key={formation.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{formation.title}</h3>
                            {formation.badge && <Badge variant="outline">{formation.badge}</Badge>}
                            <Badge variant="secondary">{formation.sort_order}</Badge>
                          </div>
                          <p className="text-primary font-medium mb-1">{formation.subtitle}</p>
                          <p className="text-gray-600 mb-2">{formation.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500 mb-2">
                            <span>Niveau: {formation.level}</span>
                            <span>Durée: {formation.duration}</span>
                            <span>Participants: {formation.participants}</span>
                            <span>Prix: {formation.price}</span>
                          </div>
                          {formation.features && (
                            <div className="flex flex-wrap gap-1">
                              {JSON.parse(formation.features).map((feature: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditingFormation(formation)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteFormation(formation.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{reservation.name}</h3>
                            <Badge 
                              variant={
                                reservation.status === 'confirmed' ? 'default' :
                                reservation.status === 'pending' ? 'secondary' :
                                reservation.status === 'completed' ? 'outline' : 'destructive'
                              }
                            >
                              {reservation.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <span className="ml-2">{reservation.email}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Téléphone:</span>
                              <span className="ml-2">{reservation.phone || 'Non fourni'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Service:</span>
                              <span className="ml-2">{reservation.service_name || reservation.service_type}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date souhaitée:</span>
                              <span className="ml-2">{reservation.preferred_date} à {reservation.preferred_time}</span>
                            </div>
                          </div>
                          {reservation.message && (
                            <div className="text-sm">
                              <span className="text-gray-500">Message:</span>
                              <p className="text-gray-600 mt-1 italic">"{reservation.message}"</p>
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-2">
                            Créée le: {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <select
                            value={reservation.status}
                            onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                            className="text-sm px-2 py-1 rounded border"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="completed">Terminée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                          <Button
                            onClick={() => deleteReservation(reservation.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {reservations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune réservation pour le moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion de l'Équipe</CardTitle>
                  <Button onClick={startCreatingTeamMember}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Membre
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingTeamMember || isCreatingTeamMember) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingTeamMember ? 'Modifier le membre' : 'Nouveau membre'}
                      </h3>
                      <Button onClick={cancelTeamMemberEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="member-slug">Slug</Label>
                        <Input
                          id="member-slug"
                          value={teamMemberFormData.slug}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="membre-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-name">Nom</Label>
                        <Input
                          id="member-name"
                          value={teamMemberFormData.name}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nom du membre"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-role">Fonction</Label>
                        <Input
                          id="member-role"
                          value={teamMemberFormData.role}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Maquilleuse Senior"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-speciality">Spécialité</Label>
                        <Input
                          id="member-speciality"
                          value={teamMemberFormData.speciality}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, speciality: e.target.value }))}
                          placeholder="Maquillage mariée"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-experience">Expérience</Label>
                        <Input
                          id="member-experience"
                          value={teamMemberFormData.experience}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, experience: e.target.value }))}
                          placeholder="10 ans d'expérience"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-image">Image</Label>
                        <Input
                          id="member-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTeamMemberFormData(prev => ({ ...prev, image_path: `/images/team/${file.name}` }));
                            }
                          }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="member-description">Description</Label>
                        <Textarea
                          id="member-description"
                          value={teamMemberFormData.description}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description du membre"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-certifications">Certifications (JSON)</Label>
                        <Textarea
                          id="member-certifications"
                          value={teamMemberFormData.certifications}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, certifications: e.target.value }))}
                          placeholder='["Certification 1", "Certification 2"]'
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-achievements">Réalisations (JSON)</Label>
                        <Textarea
                          id="member-achievements"
                          value={teamMemberFormData.achievements}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, achievements: e.target.value }))}
                          placeholder='["Réalisation 1", "Réalisation 2"]'
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-instagram">Instagram</Label>
                        <Input
                          id="member-instagram"
                          value={teamMemberFormData.social_instagram}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-linkedin">LinkedIn</Label>
                        <Input
                          id="member-linkedin"
                          value={teamMemberFormData.social_linkedin}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, social_linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-email">Email</Label>
                        <Input
                          id="member-email"
                          value={teamMemberFormData.social_email}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, social_email: e.target.value }))}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="member-sort">Ordre d'affichage</Label>
                        <Input
                          id="member-sort"
                          type="number"
                          value={teamMemberFormData.sort_order}
                          onChange={(e) => setTeamMemberFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveTeamMember}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{member.name}</h3>
                            <Badge variant="secondary">{member.sort_order}</Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500 mb-2">
                            <span>Fonction: {member.role}</span>
                            <span>Spécialité: {member.speciality}</span>
                            <span>Expérience: {member.experience}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{member.description}</p>
                          <div className="flex gap-2 text-sm">
                            {member.social_instagram && <span>📱 {member.social_instagram}</span>}
                            {member.social_linkedin && <span>💼 LinkedIn</span>}
                            {member.social_email && <span>✉️ {member.social_email}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditingTeamMember(member)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTeamMember(member.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des Témoignages</CardTitle>
                  <Button onClick={startCreatingTestimonial}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Témoignage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingTestimonial || isCreatingTestimonial) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                      </h3>
                      <Button onClick={cancelTestimonialEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="testimonial-slug">Slug</Label>
                        <Input
                          id="testimonial-slug"
                          value={testimonialFormData.slug}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="temoignage-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-name">Nom</Label>
                        <Input
                          id="testimonial-name"
                          value={testimonialFormData.name}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nom du client"
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-role">Profession/Titre</Label>
                        <Input
                          id="testimonial-role"
                          value={testimonialFormData.role}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Mariée, Professionnelle..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-rating">Note</Label>
                        <Input
                          id="testimonial-rating"
                          type="number"
                          min="1"
                          max="5"
                          value={testimonialFormData.rating}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-service">Service</Label>
                        <Input
                          id="testimonial-service"
                          value={testimonialFormData.service}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, service: e.target.value }))}
                          placeholder="Maquillage mariée, Formation..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-image">Image</Label>
                        <Input
                          id="testimonial-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setTestimonialFormData(prev => ({ ...prev, image_path: `/images/testimonials/${file.name}` }));
                            }
                          }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="testimonial-text">Témoignage</Label>
                        <Textarea
                          id="testimonial-text"
                          value={testimonialFormData.text}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Texte du témoignage"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testimonial-sort">Ordre d'affichage</Label>
                        <Input
                          id="testimonial-sort"
                          type="number"
                          value={testimonialFormData.sort_order}
                          onChange={(e) => setTestimonialFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveTestimonial}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{testimonial.name}</h3>
                            <div className="flex">
                              {Array.from({ length: testimonial.rating }, (_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <Badge variant="secondary">{testimonial.sort_order}</Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500 mb-2">
                            <span>Fonction: {testimonial.role}</span>
                            <span>Service: {testimonial.service}</span>
                          </div>
                          <p className="text-gray-600 italic">"{testimonial.text}"</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditingTestimonial(testimonial)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTestimonial(testimonial.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des FAQs</CardTitle>
                  <Button onClick={startCreatingFaq}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingFaq || isCreatingFaq) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingFaq ? 'Modifier la FAQ' : 'Nouvelle FAQ'}
                      </h3>
                      <Button onClick={cancelFaqEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="faq-question">Question</Label>
                        <Input
                          id="faq-question"
                          value={faqFormData.question}
                          onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                          placeholder="Question fréquente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq-answer">Réponse</Label>
                        <Textarea
                          id="faq-answer"
                          value={faqFormData.answer}
                          onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                          placeholder="Réponse à la question"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="faq-category">Catégorie</Label>
                          <select
                            id="faq-category"
                            value={faqFormData.category}
                            onChange={(e) => setFaqFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="general">Général</option>
                            <option value="services">Services</option>
                            <option value="formations">Formations</option>
                            <option value="tarifs">Tarifs</option>
                            <option value="pratique">Pratique</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="faq-sort">Ordre d'affichage</Label>
                          <Input
                            id="faq-sort"
                            type="number"
                            value={faqFormData.sort_order}
                            onChange={(e) => setFaqFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="faq-active">Statut</Label>
                          <select
                            id="faq-active"
                            value={faqFormData.is_active}
                            onChange={(e) => setFaqFormData(prev => ({ ...prev, is_active: parseInt(e.target.value) }))}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button onClick={saveFaq}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{faq.question}</h3>
                            <Badge variant={faq.is_active ? "default" : "secondary"}>
                              {faq.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{faq.category}</Badge>
                            <Badge variant="secondary">{faq.sort_order}</Badge>
                          </div>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditingFaq(faq)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteFaq(faq.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Gestion de la Galerie</CardTitle>
                <Button onClick={startCreatingGalleryItem} className="ml-auto bg-gradient-luxury text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un élément
                </Button>
              </CardHeader>
              <CardContent>
                {(isCreatingGalleryItem || editingGalleryItem) && (
                  <div className="p-6 border rounded-lg bg-gray-50 mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {editingGalleryItem ? 'Modifier l\'élément' : 'Nouvel élément de galerie'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gallery-slug">Slug</Label>
                        <Input
                          id="gallery-slug"
                          value={galleryFormData.slug}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="look-mariee-romantique"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gallery-title">Titre</Label>
                        <Input
                          id="gallery-title"
                          value={galleryFormData.title}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Look Mariée Romantique"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gallery-category">Catégorie</Label>
                        <select
                          id="gallery-category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={galleryFormData.category}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="Mariage">Mariage</option>
                          <option value="Soirée">Soirée</option>
                          <option value="Naturel">Naturel</option>
                          <option value="Artistique">Artistique</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="gallery-service">Service associé</Label>
                        <select
                          id="gallery-service"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={galleryFormData.service_id || ''}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, service_id: e.target.value ? parseInt(e.target.value) : null }))}
                        >
                          <option value="">Aucun service</option>
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="gallery-featured-image">Image principale</Label>
                        <Input
                          id="gallery-featured-image"
                          value={galleryFormData.featured_image}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                          placeholder="portfolio-1.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gallery-sort-order">Ordre de tri</Label>
                        <Input
                          id="gallery-sort-order"
                          type="number"
                          value={galleryFormData.sort_order}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="gallery-description">Description</Label>
                      <Textarea
                        id="gallery-description"
                        value={galleryFormData.description}
                        onChange={(e) => setGalleryFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description détaillée de la création..."
                        rows={3}
                      />
                    </div>

                    <div className="mt-4">
                      <Label>Images supplémentaires</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={currentGalleryImage}
                          onChange={(e) => setCurrentGalleryImage(e.target.value)}
                          placeholder="portfolio-2.jpg"
                          onKeyPress={(e) => e.key === 'Enter' && addGalleryImage()}
                        />
                        <Button type="button" onClick={addGalleryImage} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {galleryFormData.images.filter(img => img.trim() !== '').map((image, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-2">
                            {image}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeGalleryImage(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={galleryFormData.is_featured}
                          onChange={(e) => setGalleryFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Élément mis en avant</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <Button variant="outline" onClick={cancelGalleryItemEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={saveGalleryItem} className="bg-gradient-luxury text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {editingGalleryItem ? 'Mettre à jour' : 'Créer'}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <img
                            src={`/src/assets/${item.featured_image}`}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium">{item.title}</h3>
                              <Badge variant="outline">{item.category}</Badge>
                              {item.is_featured && <Badge className="bg-gradient-luxury text-white">Mis en avant</Badge>}
                              <Badge variant="secondary">{item.sort_order}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Images: {item.images.length}</span>
                              <span>•</span>
                              <span>Créé: {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => startEditingGalleryItem(item)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteGalleryItem(item.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Site</CardTitle>
              </CardHeader>
              <CardContent>
                {siteSettings && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="settings-site-name">Nom du site</Label>
                        <Input
                          id="settings-site-name"
                          value={settingsFormData.site_name || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, site_name: e.target.value }))}
                          placeholder="Neill Beauty"
                        />
                      </div>
                      <div>
                        <Label htmlFor="settings-contact-email">Email de contact</Label>
                        <Input
                          id="settings-contact-email"
                          type="email"
                          value={settingsFormData.contact_email || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                          placeholder="contact@neillbeauty.fr"
                        />
                      </div>
                      <div>
                        <Label htmlFor="settings-contact-phone">Téléphone de contact</Label>
                        <Input
                          id="settings-contact-phone"
                          value={settingsFormData.contact_phone || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                          placeholder="+33 6 XX XX XX XX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="settings-contact-address">Adresse</Label>
                        <Input
                          id="settings-contact-address"
                          value={settingsFormData.contact_address || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, contact_address: e.target.value }))}
                          placeholder="Paris, France"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="settings-site-description">Description du site</Label>
                        <Textarea
                          id="settings-site-description"
                          value={settingsFormData.site_description || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, site_description: e.target.value }))}
                          placeholder="Description de votre site"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="settings-business-hours">Horaires d'ouverture</Label>
                        <Textarea
                          id="settings-business-hours"
                          value={settingsFormData.business_hours || ''}
                          onChange={(e) => setSettingsFormData(prev => ({ ...prev, business_hours: e.target.value }))}
                          placeholder="Lun-Ven: 9h-18h, Sam: 9h-17h"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Réseaux sociaux</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="settings-instagram">Instagram</Label>
                          <Input
                            id="settings-instagram"
                            value={settingsFormData.social_instagram || ''}
                            onChange={(e) => setSettingsFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                            placeholder="@instagram"
                          />
                        </div>
                        <div>
                          <Label htmlFor="settings-facebook">Facebook</Label>
                          <Input
                            id="settings-facebook"
                            value={settingsFormData.social_facebook || ''}
                            onChange={(e) => setSettingsFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                            placeholder="@facebook"
                          />
                        </div>
                        <div>
                          <Label htmlFor="settings-tiktok">TikTok</Label>
                          <Input
                            id="settings-tiktok"
                            value={settingsFormData.social_tiktok || ''}
                            onChange={(e) => setSettingsFormData(prev => ({ ...prev, social_tiktok: e.target.value }))}
                            placeholder="@tiktok"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={saveSiteSettings} className="bg-gradient-luxury text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder les paramètres
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;