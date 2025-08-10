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
  X
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

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    icon_name: '',
    image_path: '',
    features: '',
    price: '',
    sort_order: 0
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setLoading(false);
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

  const startEditing = (service: Service) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      image_path: service.image_path,
      features: service.features,
      price: service.price,
      sort_order: service.sort_order
    });
  };

  const startCreating = () => {
    setIsCreating(true);
    setFormData({
      slug: '',
      title: '',
      description: '',
      icon_name: '',
      image_path: '',
      features: '',
      price: '',
      sort_order: services.length + 1
    });
  };

  const cancelEdit = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData({
      slug: '',
      title: '',
      description: '',
      icon_name: '',
      image_path: '',
      features: '',
      price: '',
      sort_order: 0
    });
  };

  const saveService = async () => {
    try {
      let response;
      const payload = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
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
        cancelEdit();
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Témoignages
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des Services</CardTitle>
                  <Button onClick={startCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {(editingService || isCreating) && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingService ? 'Modifier le service' : 'Nouveau service'}
                      </h3>
                      <Button onClick={cancelEdit} variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          placeholder="service-slug"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Nom du service"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Description du service"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="icon_name">Icône</Label>
                        <Input
                          id="icon_name"
                          value={formData.icon_name}
                          onChange={(e) => handleInputChange('icon_name', e.target.value)}
                          placeholder="nom-icone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_path">Image</Label>
                        <Input
                          id="image_path"
                          value={formData.image_path}
                          onChange={(e) => handleInputChange('image_path', e.target.value)}
                          placeholder="/images/service.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Prix</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="À partir de 50€"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sort_order">Ordre</Label>
                        <Input
                          id="sort_order"
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                        <Textarea
                          id="features"
                          value={formData.features}
                          onChange={(e) => handleInputChange('features', e.target.value)}
                          placeholder="Caractéristique 1, Caractéristique 2, Caractéristique 3"
                          rows={2}
                        />
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
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Slug: {service.slug}</span>
                            <span>Prix: {service.price}</span>
                            <span>Icône: {service.icon_name}</span>
                          </div>
                          {service.features && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Caractéristiques: </span>
                              {JSON.parse(service.features).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditing(service)}
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

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Gestion de l'Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Témoignages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Fonctionnalité en cours de développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;