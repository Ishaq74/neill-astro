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
  Star
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
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  
  // Editing states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [isCreatingFormation, setIsCreatingFormation] = useState(false);
  const [isCreatingTeamMember, setIsCreatingTeamMember] = useState(false);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);

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

  // Feature input helpers
  const [currentServiceFeature, setCurrentServiceFeature] = useState('');
  const [currentFormationFeature, setCurrentFormationFeature] = useState('');

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="formations" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Formations
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Témoignages
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

          {/* Team Tab - Placeholder for now */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Gestion de l'Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Gestion des membres de l'équipe disponible prochainement.
                </p>
                <div className="text-sm text-gray-400">
                  Fonctionnalités à venir: Ajouter/modifier/supprimer des membres, gérer leurs profils, spécialités et réseaux sociaux.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab - Placeholder for now */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Témoignages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Gestion des témoignages clients disponible prochainement.
                </p>
                <div className="text-sm text-gray-400">
                  Fonctionnalités à venir: Ajouter/modifier/supprimer des témoignages, gérer les notes et les avis clients.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab - Placeholder for now */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Gestion des questions fréquentes disponible prochainement.
                </p>
                <div className="text-sm text-gray-400">
                  Fonctionnalités à venir: Ajouter/modifier/supprimer des FAQs, organiser par catégories.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - Placeholder for now */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Site</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Gestion des paramètres généraux du site disponible prochainement.
                </p>
                <div className="text-sm text-gray-400">
                  Fonctionnalités à venir: Modifier les informations de contact, réseaux sociaux, nom du site, description, etc.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;