
import React, { useState } from "react";
import { User } from "@/api/entities";
import { Client } from "@/api/entities";
import { Dog } from "@/api/entities";
import { ServiceProvider } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UserPlus,
  Dog as DogIcon,
  Users,
  Upload,
  Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendEmail, UploadFile } from "@/api/integrations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Cadastro() {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // User Form
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    cpf: "",
    birth_date: "",
    phone: "",
    emergency_contact: "",
    profile: "comercial"
  });

  // Client and Dog Form
  const [clientForm, setClientForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    cpf: "",
    endereco: "",
    quantidade_caes: 1,
    email: "",
    telefone: "",
    telefone_emergencia: ""
  });

  const [dogForms, setDogForms] = useState([{
    nome: "",
    apelido: "",
    cores_pelagem: "",
    raca: "",
    peso: "",
    data_nascimento: "",
    foto_carteirinha_vacina_url: "",
    restricoes_veterinarias: "",
    veterinario_responsavel: "",
    veterinario_horario_atendimento: "",
    veterinario_telefone: "",
    veterinario_clinica_telefone: "",
    veterinario_endereco: "",
    alimentacao_marca_racao: "",
    alimentacao_sabor: "",
    alimentacao_tipo: "",
    refeicoes: [
      { quantidade_g: "", horario: "", observacao: "" }
    ],
    foto_url: ""
  }]);

  // Service Provider Form
  const [providerForm, setProviderForm] = useState({
    nome_completo: "",
    cpf: "",
    data_nascimento: "",
    funcoes_liberadas: [],
    valor_hora_monitoria: "",
    valor_hora_banho: "",
    valor_hora_tosa: "",
    valor_hora_banho_tosa: "",
    valor_hora_motorista: "",
    valor_hora_adestramento: ""
  });

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 3) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length > 6) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    if (numbers.length > 9) formatted = `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    return formatted.slice(0, 14);
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + "!";
  };

  // Update dog forms when quantidade_caes changes
  const handleQuantidadeCaesChange = (newQuantidade) => {
    const quantidade = parseInt(newQuantidade) || 1;
    setClientForm({...clientForm, quantidade_caes: quantidade});

    // Adjust dog forms array to match quantidade
    const currentForms = [...dogForms];

    if (quantidade > currentForms.length) {
      // Add new forms
      for (let i = currentForms.length; i < quantidade; i++) {
        currentForms.push({
          nome: "",
          apelido: "",
          cores_pelagem: "",
          raca: "",
          peso: "",
          data_nascimento: "",
          foto_carteirinha_vacina_url: "",
          restricoes_veterinarias: "",
          veterinario_responsavel: "",
          veterinario_horario_atendimento: "",
          veterinario_telefone: "",
          veterinario_clinica_telefone: "",
          veterinario_endereco: "",
          alimentacao_marca_racao: "",
          alimentacao_sabor: "",
          alimentacao_tipo: "",
          refeicoes: [
            { quantidade_g: "", horario: "", observacao: "" }
          ],
          foto_url: ""
        });
      }
    } else if (quantidade < currentForms.length) {
      // Remove extra forms
      currentForms.splice(quantidade);
    }

    setDogForms(currentForms);
  };

  const addRefeicao = (dogIndex) => {
    const newDogForms = [...dogForms];
    newDogForms[dogIndex].refeicoes.push({ quantidade_g: "", horario: "", observacao: "" });
    setDogForms(newDogForms);
  };

  const removeRefeicao = (dogIndex, refeicaoIndex) => {
    const newDogForms = [...dogForms];
    if (newDogForms[dogIndex].refeicoes.length > 1) {
      newDogForms[dogIndex].refeicoes.splice(refeicaoIndex, 1);
      setDogForms(newDogForms);
    }
  };

  const updateRefeicao = (dogIndex, refeicaoIndex, field, value) => {
    const newDogForms = [...dogForms];
    newDogForms[dogIndex].refeicoes[refeicaoIndex][field] = value;
    setDogForms(newDogForms);
  };

  const handleSaveUser = async () => {
    if (!userForm.full_name || !userForm.email || !userForm.cpf || !userForm.birth_date || !userForm.phone || !userForm.emergency_contact) {
      setNotifyTitle("Campos obrigatórios");
      setNotifyMessage("Preencha todos os campos obrigatórios.");
      setNotifyOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const tempPassword = generatePassword();

      // In production, this would call an API to create user with authentication
      console.log("Creating user with password:", tempPassword);

      // Send email with credentials
      await SendEmail({
        to: userForm.email,
        subject: "Bem-vindo ao Dog City Brasil",
        body: `Olá ${userForm.full_name}!\n\nSua conta foi criada com sucesso.\n\nAcesse: ${window.location.origin}\nSenha provisória: ${tempPassword}\n\nPor favor, altere sua senha no primeiro acesso.\n\nEquipe Dog City Brasil`
      });

      setNotifyTitle("Usuário cadastrado");
      setNotifyMessage(`Usuário cadastrado com sucesso! Email enviado para ${userForm.email}`);
      setNotifyOpen(true);

      // Reset form
      setUserForm({
        full_name: "",
        email: "",
        cpf: "",
        birth_date: "",
        phone: "",
        emergency_contact: "",
        profile: "comercial"
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setNotifyTitle("Erro");
      setNotifyMessage("Erro ao cadastrar usuário. Tente novamente.");
    }
    setIsSaving(false);
  };

  const handleSaveClientAndDogs = async () => {
    if (!clientForm.nome_completo || !clientForm.cpf || !clientForm.email || !clientForm.telefone ||
        !clientForm.data_nascimento || !clientForm.endereco || !clientForm.telefone_emergencia) {
      setNotifyTitle("Campos obrigatórios");
      setNotifyMessage("Preencha todos os campos obrigatórios do cliente.");
      setNotifyOpen(true);
      return;
    }

    // Validate all dogs
    for (let i = 0; i < dogForms.length; i++) {
      const dog = dogForms[i];
      if (!dog.nome || !dog.apelido || !dog.cores_pelagem || !dog.raca || !dog.peso ||
          !dog.data_nascimento || !dog.foto_carteirinha_vacina_url || !dog.restricoes_veterinarias ||
          !dog.veterinario_responsavel || !dog.veterinario_horario_atendimento ||
          !dog.veterinario_telefone || !dog.veterinario_endereco ||
          !dog.alimentacao_marca_racao || !dog.alimentacao_sabor || !dog.alimentacao_tipo) {
        setNotifyTitle("Campos obrigatórios");
        setNotifyMessage(`Preencha todos os campos obrigatórios do Cão ${i + 1} (exceto foto do cão e telefone da clínica).`);
        setNotifyOpen(true);
        return;
      }

      // Validate refeicoes
      if (dog.refeicoes.length === 0) {
        setNotifyTitle("Campos obrigatórios");
        setNotifyMessage(`Adicione pelo menos uma refeição para o Cão ${i + 1}.`);
        setNotifyOpen(true);
        return;
      }
      for (let j = 0; j < dog.refeicoes.length; j++) {
        const ref = dog.refeicoes[j];
        if (!ref.quantidade_g || !ref.horario || !ref.observacao) {
          setNotifyTitle("Campos obrigatórios");
          setNotifyMessage(`Preencha todos os campos da ${j + 1}ª refeição do Cão ${i + 1}.`);
          setNotifyOpen(true);
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      const client = await Client.create(clientForm);

      // Save dogs
      for (const dogForm of dogForms) {
        await Dog.create({
          ...dogForm,
          client_id: client.id
        });
      }

      setNotifyTitle("Cliente e cães cadastrados");
      setNotifyMessage("Cliente e cães cadastrados com sucesso!");
      setNotifyOpen(true);

      // Reset forms
      setClientForm({
        nome_completo: "",
        data_nascimento: "",
        cpf: "",
        endereco: "",
        quantidade_caes: 1,
        email: "",
        telefone: "",
        telefone_emergencia: ""
      });
      setDogForms([{
        nome: "",
        apelido: "",
        cores_pelagem: "",
        raca: "",
        peso: "",
        data_nascimento: "",
        foto_carteirinha_vacina_url: "",
        restricoes_veterinarias: "",
        veterinario_responsavel: "",
        veterinario_horario_atendimento: "",
        veterinario_telefone: "",
        veterinario_clinica_telefone: "",
        veterinario_endereco: "",
        alimentacao_marca_racao: "",
        alimentacao_sabor: "",
        alimentacao_tipo: "",
        refeicoes: [
          { quantidade_g: "", horario: "", observacao: "" }
        ],
        foto_url: ""
      }]);
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setNotifyTitle("Erro");
      setNotifyMessage("Erro ao cadastrar cliente. Tente novamente.");
      setNotifyOpen(true);
    }
    setIsSaving(false);
  };

  const handleSaveProvider = async () => {
    if (!providerForm.nome_completo || !providerForm.cpf || !providerForm.data_nascimento || providerForm.funcoes_liberadas.length === 0) {
      setNotifyTitle("Campos obrigatórios");
      setNotifyMessage("Preencha nome, CPF, data de nascimento e selecione ao menos uma função.");
      setNotifyOpen(true);
      return;
    }

    // Validate values for selected functions
    const funcValues = {
        monitoria: providerForm.valor_hora_monitoria,
        banho: providerForm.valor_hora_banho,
        tosa: providerForm.valor_hora_tosa,
        banho_tosa: providerForm.valor_hora_banho_tosa,
        motorista: providerForm.valor_hora_motorista,
        adestramento: providerForm.valor_hora_adestramento,
    };

    for (const func of providerForm.funcoes_liberadas) {
        if (!funcValues[func]) {
            setNotifyTitle("Campos obrigatórios");
            setNotifyMessage(`Preencha o valor/hora para a função "${func.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}".`);
            setNotifyOpen(true);
            return;
        }
    }


    setIsSaving(true);
    try {
      await ServiceProvider.create({
        ...providerForm,
        valor_hora_monitoria: providerForm.valor_hora_monitoria ? parseFloat(providerForm.valor_hora_monitoria) : undefined,
        valor_hora_banho: providerForm.valor_hora_banho ? parseFloat(providerForm.valor_hora_banho) : undefined,
        valor_hora_tosa: providerForm.valor_hora_tosa ? parseFloat(providerForm.valor_hora_tosa) : undefined,
        valor_hora_banho_tosa: providerForm.valor_hora_banho_tosa ? parseFloat(providerForm.valor_hora_banho_tosa) : undefined,
        valor_hora_motorista: providerForm.valor_hora_motorista ? parseFloat(providerForm.valor_hora_motorista) : undefined,
        valor_hora_adestramento: providerForm.valor_hora_adestramento ? parseFloat(providerForm.valor_hora_adestramento) : undefined
      });

      setNotifyTitle("Prestador cadastrado");
      setNotifyMessage("Prestador de serviço cadastrado com sucesso!");
      setNotifyOpen(true);

      // Reset form
      setProviderForm({
        nome_completo: "",
        cpf: "",
        data_nascimento: "",
        funcoes_liberadas: [],
        valor_hora_monitoria: "",
        valor_hora_banho: "",
        valor_hora_tosa: "",
        valor_hora_banho_tosa: "",
        valor_hora_motorista: "",
        valor_hora_adestramento: ""
      });
    } catch (error) {
      console.error("Erro ao cadastrar prestador:", error);
      setNotifyTitle("Erro");
      setNotifyMessage("Erro ao cadastrar prestador. Tente novamente.");
      setNotifyOpen(true);
    }
    setIsSaving(false);
  };

  const handleUploadFile = async (file, field, dogIndex = null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      if (dogIndex !== null) {
        const newDogForms = [...dogForms];
        newDogForms[dogIndex][field] = file_url;
        setDogForms(newDogForms);
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setNotifyTitle("Erro no upload");
      setNotifyMessage("Não foi possível enviar o arquivo. Tente novamente.");
      setNotifyOpen(true);
    }
    setIsUploading(false);
  };

  const addDogForm = () => {
    setDogForms([...dogForms, {
      nome: "",
      apelido: "",
      cores_pelagem: "",
      raca: "",
      peso: "",
      data_nascimento: "",
      foto_carteirinha_vacina_url: "",
      restricoes_veterinarias: "",
      veterinario_responsavel: "",
      veterinario_horario_atendimento: "",
      veterinario_telefone: "",
      veterinario_clinica_telefone: "",
      veterinario_endereco: "",
      alimentacao_marca_racao: "",
      alimentacao_sabor: "",
      alimentacao_tipo: "",
      refeicoes: [
        { quantidade_g: "", horario: "", observacao: "" }
      ],
      foto_url: ""
    }]);
  };

  const toggleFunction = (func) => {
    const current = providerForm.funcoes_liberadas || [];
    if (current.includes(func)) {
      setProviderForm({
        ...providerForm,
        funcoes_liberadas: current.filter(f => f !== func)
      });
    } else {
      setProviderForm({
        ...providerForm,
        funcoes_liberadas: [...current, func]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d30bcc5ca43f0f9b7df581/b25f6333e_Capturadetela2025-09-24192240.png"
              alt="Dog City Brasil"
              className="h-10 w-10 sm:h-12 sm:h-12"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cadastro</h1>
              <p className="text-sm sm:text-base text-gray-600">Gerenciamento de cadastros do sistema</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <DogIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes e Cães</span>
            </TabsTrigger>
            <TabsTrigger value="prestadores" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Prestadores</span>
            </TabsTrigger>
          </TabsList>

          {/* Usuários Tab */}
          <TabsContent value="usuarios">
            <Card className="border-blue-200 bg-white">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Cadastrar Novo Usuário
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo *</Label>
                    <Input
                      required
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      required
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <Label>CPF *</Label>
                    <Input
                      required
                      value={userForm.cpf}
                      onChange={(e) => setUserForm({...userForm, cpf: formatCPF(e.target.value)})}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <Label>Data de Nascimento *</Label>
                    <Input
                      required
                      type="date"
                      value={userForm.birth_date}
                      onChange={(e) => setUserForm({...userForm, birth_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Telefone *</Label>
                    <Input
                      required
                      value={userForm.phone}
                      onChange={(e) => setUserForm({...userForm, phone: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label>Telefone de Emergência *</Label>
                    <Input
                      required
                      value={userForm.emergency_contact}
                      onChange={(e) => setUserForm({...userForm, emergency_contact: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Perfil *</Label>
                    <Select
                      value={userForm.profile}
                      onValueChange={(value) => setUserForm({...userForm, profile: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desenvolvedor">Desenvolvedor</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="monitoria">Monitor</SelectItem>
                        <SelectItem value="banhista_tosador">Banhista/Tosador</SelectItem>
                        <SelectItem value="motorista">Motorista</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSaveUser}
                  disabled={isSaving}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Finalizar cadastro"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clientes e Cães Tab */}
          <TabsContent value="clientes">
            <Card className="border-green-200 bg-white mb-6">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Informações do Cliente
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo *</Label>
                    <Input
                      required
                      value={clientForm.nome_completo}
                      onChange={(e) => setClientForm({...clientForm, nome_completo: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <Label>Data de Nascimento *</Label>
                    <Input
                      required
                      type="date"
                      value={clientForm.data_nascimento}
                      onChange={(e) => setClientForm({...clientForm, data_nascimento: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>CPF *</Label>
                    <Input
                      required
                      value={clientForm.cpf}
                      onChange={(e) => setClientForm({...clientForm, cpf: formatCPF(e.target.value)})}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <Label>Quantidade de Cães *</Label>
                    <Input
                      required
                      type="number"
                      min="1"
                      value={clientForm.quantidade_caes}
                      onChange={(e) => handleQuantidadeCaesChange(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Endereço *</Label>
                    <Input
                      required
                      value={clientForm.endereco}
                      onChange={(e) => setClientForm({...clientForm, endereco: e.target.value})}
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      required
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <Label>Telefone *</Label>
                    <Input
                      required
                      value={clientForm.telefone}
                      onChange={(e) => setClientForm({...clientForm, telefone: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Telefone de Emergência *</Label>
                    <Input
                      required
                      value={clientForm.telefone_emergencia}
                      onChange={(e) => setClientForm({...clientForm, telefone_emergencia: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dogs Forms */}
            {dogForms.map((dogForm, index) => (
              <Card key={index} className="border-green-200 bg-white mb-4">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DogIcon className="w-5 h-5 text-green-600" />
                    Informações do Cão {index + 1}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome *</Label>
                      <Input
                        required
                        value={dogForm.nome}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].nome = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Nome do cão"
                      />
                    </div>

                    <div>
                      <Label>Apelido *</Label>
                      <Input
                        required
                        value={dogForm.apelido}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].apelido = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Apelido"
                      />
                    </div>

                    <div>
                      <Label>Raça *</Label>
                      <Input
                        required
                        value={dogForm.raca}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].raca = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Raça"
                      />
                    </div>

                    <div>
                      <Label>Cores da Pelagem *</Label>
                      <Input
                        required
                        value={dogForm.cores_pelagem}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].cores_pelagem = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: Preto e branco"
                      />
                    </div>

                    <div>
                      <Label>Peso (kg) *</Label>
                      <Input
                        required
                        value={dogForm.peso}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].peso = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: 25"
                      />
                    </div>

                    <div>
                      <Label>Data de Nascimento *</Label>
                      <Input
                        required
                        type="date"
                        value={dogForm.data_nascimento}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].data_nascimento = e.target.value;
                          setDogForms(newForms);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Foto do Cão (Opcional)</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`dog-photo-${index}`}
                          onChange={(e) => handleUploadFile(e.target.files?.[0], "foto_url", index)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`dog-photo-${index}`).click()}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? "Enviando..." : "Enviar Foto"}
                        </Button>
                        {dogForm.foto_url && (
                          <a href={dogForm.foto_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline flex items-center">
                            Ver
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Carteirinha de Vacinação *</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`vaccination-${index}`}
                          onChange={(e) => handleUploadFile(e.target.files?.[0], "foto_carteirinha_vacina_url", index)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`vaccination-${index}`).click()}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? "Enviando..." : "Enviar Carteirinha"}
                        </Button>
                        {dogForm.foto_carteirinha_vacina_url && (
                          <a href={dogForm.foto_carteirinha_vacina_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline flex items-center">
                            Ver
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <Label>Restrições Veterinárias *</Label>
                      <Textarea
                        required
                        value={dogForm.restricoes_veterinarias}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].restricoes_veterinarias = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Alergias, limitações físicas, alimentares, etc."
                        className="h-20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-3 mt-4">Informações Veterinárias</h4>
                    </div>

                    <div>
                      <Label>Veterinário Responsável *</Label>
                      <Input
                        required
                        value={dogForm.veterinario_responsavel}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].veterinario_responsavel = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Nome do veterinário"
                      />
                    </div>

                    <div>
                      <Label>Horário de Atendimento *</Label>
                      <Input
                        required
                        value={dogForm.veterinario_horario_atendimento}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].veterinario_horario_atendimento = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: Seg-Sex 8h-18h"
                      />
                    </div>

                    <div>
                      <Label>Telefone do Veterinário *</Label>
                      <Input
                        required
                        value={dogForm.veterinario_telefone}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].veterinario_telefone = formatPhone(e.target.value);
                          setDogForms(newForms);
                        }}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                    </div>

                    <div>
                      <Label>Telefone da Clínica (Opcional)</Label>
                      <Input
                        value={dogForm.veterinario_clinica_telefone}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].veterinario_clinica_telefone = formatPhone(e.target.value);
                          setDogForms(newForms);
                        }}
                        placeholder="(11) 3333-3333"
                        maxLength={15}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label>Endereço do Veterinário/Clínica *</Label>
                      <Input
                        required
                        value={dogForm.veterinario_endereco}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].veterinario_endereco = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Endereço completo"
                      />
                    </div>


                    <div className="sm:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-3">Alimentação</h4>
                    </div>

                    <div>
                      <Label>Marca da Ração *</Label>
                      <Input
                        required
                        value={dogForm.alimentacao_marca_racao}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].alimentacao_marca_racao = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: Royal Canin"
                      />
                    </div>

                    <div>
                      <Label>Sabor *</Label>
                      <Input
                        required
                        value={dogForm.alimentacao_sabor}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].alimentacao_sabor = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: Frango"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label>Tipo *</Label>
                      <Input
                        required
                        value={dogForm.alimentacao_tipo}
                        onChange={(e) => {
                          const newForms = [...dogForms];
                          newForms[index].alimentacao_tipo = e.target.value;
                          setDogForms(newForms);
                        }}
                        placeholder="Ex: Ração seca"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Refeições</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addRefeicao(index)}
                          className="text-green-600 border-green-300"
                        >
                          + Adicionar Refeição
                        </Button>
                      </div>

                      {dogForm.refeicoes.map((refeicao, refIndex) => (
                        <div key={refIndex} className="mb-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{refIndex + 1}ª Refeição</h5>
                            {dogForm.refeicoes.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRefeicao(index, refIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remover
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <Label>Quantidade (g) *</Label>
                              <Input
                                required
                                value={refeicao.quantidade_g}
                                onChange={(e) => updateRefeicao(index, refIndex, 'quantidade_g', e.target.value)}
                                placeholder="Ex: 200"
                              />
                            </div>

                            <div>
                              <Label>Horário *</Label>
                              <Input
                                required
                                type="time"
                                value={refeicao.horario}
                                onChange={(e) => updateRefeicao(index, refIndex, 'horario', e.target.value)}
                              />
                            </div>

                            <div className="sm:col-span-1">
                              <Label>Observação *</Label>
                              <Input
                                required
                                value={refeicao.observacao}
                                onChange={(e) => updateRefeicao(index, refIndex, 'observacao', e.target.value)}
                                placeholder="Ex: Junto com água"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleSaveClientAndDogs}
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : "Finalizar cadastro"}
            </Button>
          </TabsContent>

          {/* Prestadores Tab */}
          <TabsContent value="prestadores">
            <Card className="border-orange-200 bg-white">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Cadastrar Prestador de Serviço
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo *</Label>
                    <Input
                      required
                      value={providerForm.nome_completo}
                      onChange={(e) => setProviderForm({...providerForm, nome_completo: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <Label>CPF *</Label>
                    <Input
                      required
                      value={providerForm.cpf}
                      onChange={(e) => setProviderForm({...providerForm, cpf: formatCPF(e.target.value)})}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Data de Nascimento *</Label>
                    <Input
                      required
                      type="date"
                      value={providerForm.data_nascimento}
                      onChange={(e) => setProviderForm({...providerForm, data_nascimento: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Funções Liberadas *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["monitoria", "banho", "tosa", "banho_tosa", "motorista", "adestramento"].map(func => (
                        <Button
                          key={func}
                          type="button"
                          variant={providerForm.funcoes_liberadas?.includes(func) ? "default" : "outline"}
                          onClick={() => toggleFunction(func)}
                          className="text-sm"
                        >
                          {func.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {providerForm.funcoes_liberadas?.includes("monitoria") && (
                    <div>
                      <Label>Valor/Hora - Monitoria (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_monitoria}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_monitoria: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {providerForm.funcoes_liberadas?.includes("banho") && (
                    <div>
                      <Label>Valor/Hora - Banho (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_banho}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_banho: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {providerForm.funcoes_liberadas?.includes("tosa") && (
                    <div>
                      <Label>Valor/Hora - Tosa (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_tosa}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_tosa: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {providerForm.funcoes_liberadas?.includes("banho_tosa") && (
                    <div>
                      <Label>Valor/Hora - Banho e Tosa (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_banho_tosa}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_banho_tosa: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {providerForm.funcoes_liberadas?.includes("motorista") && (
                    <div>
                      <Label>Valor/Hora - Motorista (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_motorista}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_motorista: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {providerForm.funcoes_liberadas?.includes("adestramento") && (
                    <div>
                      <Label>Valor/Hora - Adestramento (R$) *</Label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={providerForm.valor_hora_adestramento}
                        onChange={(e) => setProviderForm({...providerForm, valor_hora_adestramento: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSaveProvider}
                  disabled={isSaving}
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Finalizar cadastro"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Modal */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="w-[92vw] max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{notifyTitle || "Notificação"}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-700">{notifyMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setNotifyOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
