import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://mtthdfprwhvnwwjblwnr.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGhkZnByd2h2bnd3amJsd25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2NTg0NSwiZXhwIjoyMDk0NTQxODQ1fQ.WWzPdLrn8NAUm_TkVwwsid4VOiZ0uZP00FPCFuFRLgI";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createAdmin(email, password) {
  console.log(`Criando usuário admin: ${email}...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
    return;
  }

  console.log('Usuário criado com sucesso!', data.user.id);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Uso: node scripts/create-admin.js <email> <senha>');
} else {
  createAdmin(email, password);
}
