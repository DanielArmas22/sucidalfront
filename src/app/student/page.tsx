"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { mockApi } from "@/lib/mock-data";
import { Post, PostCategory, POST_CATEGORIES, REACTION_TYPES } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import {
  MessageCircle,
  Plus,
  Search,
  Filter,
  Heart,
  Eye,
  EyeOff,
  Send,
  Users,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

export default function StudentForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | "all"
  >("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general" as PostCategory,
    isAnonymous: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await mockApi.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await mockApi.createPost({
        authorId: user.id,
        authorName: newPost.isAnonymous ? "Usuario Anónimo" : user.name,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        isAnonymous: newPost.isAnonymous,
      });

      setNewPost({
        title: "",
        content: "",
        category: "general",
        isAnonymous: false,
      });
      setShowCreatePost(false);
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = POST_CATEGORIES.map((category) => ({
    ...category,
    count: posts.filter((p) => p.category === category.value).length,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-green-600" />
                Foro Estudiantil
              </h1>
              <p className="text-gray-600 mt-1">
                Un espacio seguro para compartir, aprender y apoyarnos
                mutuamente
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{posts.length} publicaciones</span>
              </div>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Publicación
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categorías y estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar publicaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Categoría
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === "all"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "hover:bg-gray-100"
                      )}
                    >
                      Todas las categorías
                      <span className="float-right text-gray-500">
                        {posts.length}
                      </span>
                    </button>
                    {categoryStats.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          selectedCategory === category.value
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "hover:bg-gray-100"
                        )}
                      >
                        {category.label}
                        <span className="float-right text-gray-500">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hoy</span>
                    <span className="font-medium">
                      {
                        posts.filter((p) => {
                          const today = new Date();
                          return (
                            p.createdAt.toDateString() === today.toDateString()
                          );
                        }).length
                      }{" "}
                      publicaciones
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Esta semana</span>
                    <span className="font-medium">
                      {
                        posts.filter((p) => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return p.createdAt >= weekAgo;
                        }).length
                      }{" "}
                      publicaciones
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total reacciones</span>
                    <span className="font-medium">
                      {posts.reduce((sum, p) => sum + p.reactions.length, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Formulario crear publicación */}
            {showCreatePost && (
              <Card className="border-green-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-700">
                    Nueva Publicación
                  </CardTitle>
                  <CardDescription>
                    Comparte tus pensamientos de manera segura y respetuosa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Título
                      </label>
                      <Input
                        placeholder="¿De qué quieres hablar?"
                        value={newPost.title}
                        onChange={(e) =>
                          setNewPost({ ...newPost, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Categoría
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            category: e.target.value as PostCategory,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {POST_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Contenido
                      </label>
                      <Textarea
                        placeholder="Expresa tus ideas, sentimientos o experiencias. Este es un espacio seguro y de apoyo."
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPost.isAnonymous}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              isAnonymous: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-2">
                          {newPost.isAnonymous ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          Publicar de forma anónima
                        </span>
                      </label>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreatePost(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Lista de publicaciones */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm || selectedCategory !== "all"
                        ? "No se encontraron publicaciones"
                        : "Sé el primero en publicar"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || selectedCategory !== "all"
                        ? "Intenta con otros términos de búsqueda o categorías"
                        : "Comparte tus pensamientos y comienza la conversación"}
                    </p>
                    {!showCreatePost &&
                      !searchTerm &&
                      selectedCategory === "all" && (
                        <Button
                          onClick={() => setShowCreatePost(true)}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Primera Publicación
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const category = POST_CATEGORIES.find((c) => c.value === post.category);

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                {post.isAnonymous ? (
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  </div>
                ) : (
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {post.authorName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{post.authorName}</p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
              </div>
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category.label}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {REACTION_TYPES.map((reactionType) => {
              const count = post.reactions.filter(
                (r) => r.type === reactionType.value
              ).length;
              return (
                <button
                  key={reactionType.value}
                  className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  title={reactionType.label}
                >
                  <span className="text-sm">{reactionType.emoji}</span>
                  {count > 0 && (
                    <span className="text-xs text-gray-600">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.replies.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.replies.length} respuestas</span>
              </div>
            )}
          </div>
        </div>

        {post.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {post.replies.slice(0, 2).map((reply) => (
              <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {reply.isAnonymous ? (
                    <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <EyeOff className="h-3 w-3 text-gray-600" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xs">
                        {reply.authorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {reply.authorName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(reply.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{reply.content}</p>
              </div>
            ))}
            {post.replies.length > 2 && (
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Ver todas las respuestas ({post.replies.length})
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
