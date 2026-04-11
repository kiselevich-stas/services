<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import UiButton from "../../../../components/ui/UiButton.vue"

type TeamSocialNetworks = {
  tw?: string
  vk?: string
  ok?: string
  fb?: string
  instagram?: string
  youtube?: string
  telegram?: string
}

type TeamHeadCoach = {
  name?: string
  photo?: string
}

type Team = {
  name: string
  image?: string | null
  location?: string
  division?: string | null
  conference?: string | null
  stage?: string | null
  foundationYear?: string | null
  socialNetworks?: TeamSocialNetworks
  headCoach?: TeamHeadCoach
}

const props = defineProps<{
  team?: Team
  isLoading?: boolean
}>()

const socialLinks = computed(() => {
  const socials = props.team?.socialNetworks
  if (!socials) return []

  return [
    { key: 'vk', label: 'VK', url: socials.vk },
    { key: 'telegram', label: 'Telegram', url: socials.telegram },
    { key: 'youtube', label: 'YouTube', url: socials.youtube },
    { key: 'instagram', label: 'Instagram', url: socials.instagram },
    { key: 'ok', label: 'OK', url: socials.ok },
    { key: 'fb', label: 'Facebook', url: socials.fb },
    { key: 'tw', label: 'X', url: socials.tw },
  ].filter((item) => item.url)
})
</script>

<template>
  <header class="team-hero">
    <div class="team-hero__glow" />

    <template v-if="isLoading">
      <div class="team-hero__main">
        <div class="team-hero__logo-wrap team-hero__logo-wrap--skeleton">
          <div class="skeleton team-hero__logo-skeleton" />
        </div>

        <div class="team-hero__content">
          <div class="skeleton team-hero__caption-skeleton" />
          <div class="skeleton team-hero__title-skeleton" />
          <div class="skeleton team-hero__meta-skeleton" />

          <div class="team-hero__tags">
            <div class="skeleton team-hero__tag-skeleton" />
            <div class="skeleton team-hero__tag-skeleton" />
            <div class="skeleton team-hero__tag-skeleton" />
          </div>
        </div>
      </div>

      <div class="team-hero__actions">
        <div class="skeleton team-hero__button-skeleton" />
        <div class="skeleton team-hero__button-skeleton" />
      </div>
    </template>

    <template v-else-if="team">
      <div class="team-hero__main">
        <div
            v-if="team.image"
            class="team-hero__logo-wrap"
        >
          <img
              :src="team.image"
              :alt="team.name"
              class="team-hero__logo"
          >
        </div>

        <div class="team-hero__content">
          <p class="team-hero__caption">Команда КХЛ</p>

          <h1 class="team-hero__title">
            {{ team.name }}
          </h1>

          <p class="team-hero__meta">
            {{ team.location }}
            <span v-if="team.foundationYear">
              · c {{ team.foundationYear }}
            </span>
          </p>

          <div class="team-hero__tags">
            <span
                v-if="team.division"
                class="team-hero__tag"
            >
              {{ team.division }}
            </span>

            <span
                v-if="team.conference"
                class="team-hero__tag"
            >
              {{ team.conference }}
            </span>

            <span
                v-if="team.stage"
                class="team-hero__tag"
            >
              {{ team.stage }}
            </span>
          </div>

<!--          <div-->
<!--              v-if="socialLinks.length"-->
<!--              class="team-hero__socials"-->
<!--          >-->
<!--            <a-->
<!--                v-for="social in socialLinks"-->
<!--                :key="social.key"-->
<!--                :href="social.url"-->
<!--                target="_blank"-->
<!--                rel="noopener noreferrer"-->
<!--                class="team-hero__social-link"-->
<!--            >-->
<!--              {{ social.label }}-->
<!--            </a>-->
<!--          </div>-->
        </div>
      </div>

      <div class="team-hero__actions">
        <RouterLink to="/hockey/teams">
          <UiButton variant="secondary">
            Все команды
          </UiButton>
        </RouterLink>

        <RouterLink to="/hockey">
          <UiButton>
            К матчам
          </UiButton>
        </RouterLink>
      </div>
    </template>
  </header>
</template>

<style scoped lang="scss">
.team-hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border-radius: 28px;
  border: 1px solid var(--team-color-32);
  background:
      linear-gradient(
              180deg,
              var(--team-color-12) 0%,
              rgba(13, 18, 35, 0.94) 48%,
              rgba(13, 18, 35, 0.88) 100%
      );
  box-shadow:
      0 14px 36px rgba(0, 0, 0, 0.24),
      0 0 24px var(--team-color-08);
}

.team-hero__glow {
  position: absolute;
  top: -40px;
  left: 60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--team-color-20) 0%, transparent 72%);
  filter: blur(32px);
  pointer-events: none;
}

.team-hero__main,
.team-hero__actions {
  position: relative;
  z-index: 1;
}

.team-hero__main {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.team-hero__logo-wrap {
  flex-shrink: 0;
  width: 112px;
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--team-color-24);
}

.team-hero__logo-wrap--skeleton {
  background: rgba(255, 255, 255, 0.03);
}

.team-hero__logo {
  width: 84px;
  height: 84px;
  object-fit: contain;
}

.team-hero__logo-skeleton {
  width: 84px;
  height: 84px;
  border-radius: 20px;
}

.team-hero__caption {
  margin: 0 0 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.team-hero__title {
  margin: 0;
  font-size: 36px;
  line-height: 1.05;
  color: var(--team-color);
}

.team-hero__meta {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.72);
}

.team-hero__tags,
.team-hero__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.team-hero__tag,
.team-hero__social-link {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  text-decoration: none;
}

.team-hero__tag {
  background: var(--team-color-12);
  border: 1px solid var(--team-color-20);
  color: rgba(255, 255, 255, 0.9);
}

.team-hero__social-link {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.team-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.team-hero__caption-skeleton {
  width: 120px;
  height: 14px;
  margin-bottom: 10px;
}

.team-hero__title-skeleton {
  width: 260px;
  max-width: 100%;
  height: 40px;
  margin-bottom: 12px;
}

.team-hero__meta-skeleton {
  width: 180px;
  height: 18px;
}

.team-hero__tag-skeleton {
  width: 110px;
  height: 30px;
  border-radius: 999px;
}

.team-hero__button-skeleton {
  width: 124px;
  height: 42px;
  border-radius: 999px;
}

.skeleton {
  background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.06) 25%,
          rgba(255, 255, 255, 0.14) 50%,
          rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite linear;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>