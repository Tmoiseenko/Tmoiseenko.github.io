<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Github, ArrowUpRight, Terminal } from "lucide-vue-next";
import portfolioRu from "./portfolio/ru.json";
import portfolioEn from "./portfolio/en.json";
import portfolioUz from "./portfolio/uz.json";
import uiRu from "./locales/ru.json";
import uiEn from "./locales/en.json";
import uiUz from "./locales/uz.json";
import { PluralForms, PortfolioData, UiDictionary } from "./types";

type Locale = "ru" | "en" | "uz";

const portfolioByLocale: Record<Locale, PortfolioData> = {
  ru: portfolioRu as PortfolioData,
  en: portfolioEn as PortfolioData,
  uz: portfolioUz as PortfolioData,
};

const uiByLocale: Record<Locale, UiDictionary> = {
  ru: uiRu as UiDictionary,
  en: uiEn as UiDictionary,
  uz: uiUz as UiDictionary,
};

const localeStorageKey = "portfolio-locale";

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(localeStorageKey);
  if (stored === "ru" || stored === "en" || stored === "uz") return stored;

  const browserLocale = window.navigator.language.toLowerCase();
  if (browserLocale.startsWith("ru")) return "ru";
  if (browserLocale.startsWith("uz")) return "uz";
  return "en";
}

const currentLocale = ref<Locale>(detectLocale());
const data = computed(() => portfolioByLocale[currentLocale.value]);
const ui = computed(() => uiByLocale[currentLocale.value]);
const currentYear = computed(() => new Date().getFullYear());
const sourceFile = computed(() => `portfolio/${currentLocale.value}.json`);

const navItems = computed(() => [
  { key: "about", label: ui.value.nav.about },
  { key: "projects", label: ui.value.nav.projects },
  { key: "skills", label: ui.value.nav.skills },
  { key: "experience", label: ui.value.nav.experience },
]);

watch(
  currentLocale,
  (locale) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(localeStorageKey, locale);
    document.documentElement.lang = locale;
    document.title = uiByLocale[locale].pageTitle;
  },
  { immediate: true },
);

function setLocale(locale: Locale) {
  currentLocale.value = locale;
}

function parseMonth(value: string) {
  const [yearPart, monthPart] = value.split("-").map(Number);
  return { year: yearPart, month: monthPart };
}

function getPluralForm(value: number, forms: PluralForms) {
  const pluralRule = new Intl.PluralRules(ui.value.localeCode).select(value) as keyof PluralForms;
  return forms[pluralRule] ?? forms.other ?? forms.many ?? forms.few ?? forms.one;
}

function formatMonth(value: string) {
  const { year, month } = parseMonth(value);
  const formatted = new Intl.DateTimeFormat(ui.value.localeCode, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getMonthDifference(from: string, to: string) {
  const start = parseMonth(from);
  const end = parseMonth(to);
  return (end.year - start.year) * 12 + (end.month - start.month) + 1;
}

function formatDuration(from: string, to: string) {
  const endValue = to || `${currentYear.value}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const totalMonths = getMonthDifference(from, endValue);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(`${years} ${getPluralForm(years, ui.value.experience.duration.year)}`);
  if (months > 0) parts.push(`${months} ${getPluralForm(months, ui.value.experience.duration.month)}`);

  return parts.join(" ");
}

function formatExperiencePeriod(from: string, to: string) {
  const endLabel = to ? formatMonth(to) : ui.value.experience.present;
  return `${formatMonth(from)} — ${endLabel} (${formatDuration(from, to)})`;
}
</script>

<template>
  <div class="min-h-screen selection:bg-accent selection:text-white bg-bg text-white font-sans">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-slate-800 bg-bg/80 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-accent rounded-sm flex items-center justify-center font-bold text-slate-950 text-xl tracking-tighter">
          {{ data.name.split(' ').map(n => n[0]).join('') }}
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-extrabold tracking-tighter uppercase leading-none">{{ data.name }}</span>
          <span class="text-[10px] font-mono text-accent leading-none mt-1 uppercase tracking-widest">// {{ data.role }}</span>
        </div>
      </div>
      <div class="flex items-center gap-4 md:gap-8">
        <div class="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <a v-for="item in navItems" :key="item.key" :href="`#${item.key}`" class="hover:text-accent transition-colors">
            {{ item.label }}
          </a>
        </div>
        <div class="flex items-center gap-1 border border-slate-800 bg-slate-900/50 p-1 rounded-sm">
          <button
            type="button"
            class="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors rounded-sm"
            :class="currentLocale === 'ru' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-white'"
            @click="setLocale('ru')"
          >
            {{ ui.language.ru }}
          </button>
          <button
            type="button"
            class="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors rounded-sm"
            :class="currentLocale === 'en' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-white'"
            @click="setLocale('en')"
          >
            {{ ui.language.en }}
          </button>
          <button
            type="button"
            class="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors rounded-sm"
            :class="currentLocale === 'uz' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-white'"
            @click="setLocale('uz')"
          >
            {{ ui.language.uz }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-20 relative overflow-hidden">
      <!-- Geometric Background Element -->
      <div class="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-y-1/2"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div v-if="data.avatar" class="relative group shrink-0">
          <div class="absolute -inset-2 bg-accent/20 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <img 
            :src="data.avatar" 
            :alt="data.name" 
            class="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm border-2 border-accent/20 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        <div class="flex-1">
          <span class="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-6 block">{{ ui.hero.availability }}</span>
          <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none max-w-4xl">
            {{ data.name }}
          </h1>
          <div class="flex flex-col gap-10">
            <p class="text-xl text-text-muted max-w-xl leading-relaxed border-l border-accent/20 pl-6">
              {{ data.bio }}
            </p>
            <div class="flex flex-wrap gap-4">
              <a v-if="data.socials.github" :href="data.socials.github" target="_blank" rel="noreferrer" class="w-12 h-12 flex items-center justify-center bg-surface border border-slate-800 rounded-sm hover:border-accent transition-all group">
                <Github class="w-5 h-5 group-hover:text-accent" />
              </a>
              <a v-if="data.socials.telegram" :href="data.socials.telegram" target="_blank" rel="noreferrer" class="w-12 h-12 flex items-center justify-center bg-surface border border-slate-800 rounded-sm hover:border-accent transition-all group">
                <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current group-hover:text-accent">
                  <path d="M11.944 0C5.352 0 0 5.352 0 11.944c0 6.592 5.352 11.944 11.944 11.944 6.592 0 11.944-5.352 11.944-11.944C23.888 5.352 18.536 0 11.944 0zm5.824 8.216l-1.952 9.2c-.144.656-.536.816-1.088.512l-2.976-2.192-1.44 1.384c-.16.16-.288.288-.448.288l.216-3.056 5.568-5.032c.24-.216-.048-.336-.368-.128l-6.88 4.336-2.96-.928c-.64-.2-.656-.64.128-.944l11.568-4.456c.536-.2 1.008.12.848.96z"/>
                </svg>
              </a>
              <a :href="`mailto:${data.email}`" class="px-8 h-12 flex items-center justify-center bg-accent text-slate-950 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-all">
                {{ ui.hero.contact }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- About Section -->
    <section v-if="data.about" id="about" class="py-24 px-6 md:px-12 lg:px-24">
      <div class="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <span class="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-1 block">{{ ui.dataSourceLabel }} // {{ sourceFile }}</span>
          <h2 class="text-4xl font-light tracking-tight">{{ ui.about.title }} <span class="font-bold text-accent underline decoration-1 underline-offset-8 decoration-accent/30">// {{ ui.about.accent }}</span></h2>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div class="relative">
          <div class="text-sm text-slate-400 leading-relaxed font-sans space-y-4 whitespace-pre-wrap">
            {{ data.about }}
          </div>
          <div class="mt-8 flex items-center gap-4 text-accent font-mono text-[10px] uppercase tracking-widest">
            <Terminal class="w-4 h-4" />
            <span>{{ ui.about.endTransmission }}</span>
          </div>
        </div>
        <div class="bg-slate-900/30 border border-slate-800 p-10 rounded-sm">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{{ ui.about.competenciesTitle }}</h3>
          <div class="space-y-6">
            <div v-for="item in data.competencies" :key="item.label" class="group">
              <div class="text-slate-200 font-bold text-sm mb-1 group-hover:text-accent transition-colors">{{ item.label }}</div>
              <div class="text-xs text-slate-500">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-24 px-6 md:px-12 lg:px-24">
      <div class="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <span class="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-1 block">{{ ui.dataSourceLabel }} // {{ sourceFile }}</span>
          <h2 class="text-4xl font-light tracking-tight">{{ ui.projects.title }} <span class="font-bold text-accent underline decoration-1 underline-offset-8 decoration-accent/30">{{ ui.projects.accent }}</span></h2>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="(project, index) in data.projects" :key="project.id" class="group relative bg-slate-900/40 border border-slate-800 rounded-sm overflow-hidden hover:border-accent/40 transition-all flex flex-col h-full animate-in fade-in slide-in-from-bottom-4" :style="{ animationDelay: `${index * 100}ms` }">
          <div class="p-8 flex flex-col h-full">
            <div class="flex justify-between items-center mb-8">
              <span class="text-[10px] font-mono text-accent uppercase tracking-widest">
                {{ (index + 1).toString().padStart(2, '0') }} / {{ project.tags[0] }}
              </span>
              <div class="w-8 h-px bg-slate-700"></div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-2xl font-bold mb-4 flex items-center gap-2 group-hover:text-accent transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-sm text-slate-400 mb-8 leading-relaxed">
                {{ project.description }}
              </p>
            </div>

            <div class="flex justify-between items-end mt-auto">
              <div class="flex gap-2">
                <div class="w-2 h-2 rounded-full bg-accent"></div>
                <div class="w-2 h-2 rounded-full bg-slate-700"></div>
                <div class="w-2 h-2 rounded-full bg-slate-700"></div>
              </div>
              <div class="flex gap-3">
                <a v-if="project.github" :href="project.github" target="_blank"><Github class="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" /></a>
                <a v-if="project.link" :href="project.link" target="_blank"><ArrowUpRight class="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-24 px-6 md:px-12 lg:px-24">
      <div class="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <span class="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-1 block">{{ ui.dataSourceLabel }} // {{ sourceFile }}</span>
          <h2 class="text-4xl font-light tracking-tight">{{ ui.skills.title }} <span class="font-bold text-accent underline decoration-1 underline-offset-8 decoration-accent/30">{{ ui.skills.accent }}</span></h2>
        </div>
      </div>
      <div class="flex flex-wrap gap-4">
        <div v-for="(skill, index) in data.skills" :key="skill.name" class="px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-sm hover:border-accent/30 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2" :style="{ animationDelay: `${index * 50}ms` }">
          <span class="text-[10px] font-mono text-accent">0x{{ (index + 1).toString(16).padStart(2, '0') }}</span>
          <span class="text-sm font-bold uppercase tracking-tight">{{ skill.name }}</span>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="py-24 px-6 md:px-12 lg:px-24">
      <div class="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <span class="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-1 block">{{ ui.dataSourceLabel }} // {{ sourceFile }}</span>
          <h2 class="text-4xl font-light tracking-tight">{{ ui.experience.title }} <span class="font-bold text-accent underline decoration-1 underline-offset-8 decoration-accent/30">{{ ui.experience.accent }}</span></h2>
        </div>
      </div>
      <div class="space-y-16 max-w-4xl">
        <div v-for="(exp, index) in data.experience" :key="index" class="group animate-in fade-in slide-in-from-left-4" :style="{ animationDelay: `${index * 150}ms` }">
          <div class="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
            <div class="text-4xl font-black text-slate-800 group-hover:text-accent/20 transition-colors font-mono">0{{ index + 1 }}.</div>
            <div class="flex-1">
              <div class="flex justify-between items-baseline mb-2">
                <h3 class="text-2xl font-bold uppercase">{{ exp.role }}</h3>
                <div class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{{ formatExperiencePeriod(exp.from, exp.to) }}</div>
              </div>
              <div class="text-accent font-mono text-xs uppercase tracking-widest mb-4">// {{ exp.company }}</div>
              <p class="text-sm text-slate-400 leading-relaxed max-w-2xl">
                {{ exp.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- footer -->
    <footer class="py-20 border-t border-slate-800 bg-slate-950/50 px-6 md:px-12 lg:px-24">
      <div class="flex flex-col md:flex-row justify-between items-center gap-10">
        <div class="flex gap-12 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
          <a v-if="data.socials.github" :href="data.socials.github" class="hover:text-accent transition-colors">GitHub</a>
          <a v-if="data.socials.telegram" :href="data.socials.telegram" class="hover:text-accent transition-colors">Telegram</a>
          <a :href="`mailto:${data.email}`" class="hover:text-accent transition-colors">{{ ui.footer.email }}</a>
        </div>

      </div>
      <div class="mt-16 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
        © {{ currentYear }} • {{ ui.footer.signature }}
      </div>
    </footer>
  </div>
</template>

<style>
@import "tailwindcss";

/* Minimalist layout support */
html {
  scroll-behavior: smooth;
}
</style>
