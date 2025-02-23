import type { Schema, Attribute } from '@strapi/strapi';

export interface SectionsHeroSection extends Schema.Component {
  collectionName: 'components_sections_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    heading: Attribute.String;
    subheading: Attribute.String;
    image: Attribute.Media<'images'>;
    link: Attribute.Component<'elements.link', true>;
  };
}

export interface SectionsHeader extends Schema.Component {
  collectionName: 'components_sections_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    logo: Attribute.Component<'elements.link'>;
    button: Attribute.Component<'elements.link'>;
  };
}

export interface SectionsFooter extends Schema.Component {
  collectionName: 'components_sections_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    logo: Attribute.Component<'elements.link'>;
    text: Attribute.Blocks;
    social_Links: Attribute.Component<'elements.link', true>;
  };
}

export interface SectionsFeaturesSection extends Schema.Component {
  collectionName: 'components_sections_features_sections';
  info: {
    displayName: 'Features Section';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    features: Attribute.Component<'elements.featur', true>;
    description: Attribute.Text;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    name: Attribute.String;
    url: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ElementsFeatur extends Schema.Component {
  collectionName: 'components_elements_featurs';
  info: {
    displayName: 'feature';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    subheading: Attribute.Text;
    icon: Attribute.Enumeration<['CLOCK_ICON', 'CHECK_ICON', 'CLOUD_ICON']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'sections.hero-section': SectionsHeroSection;
      'sections.header': SectionsHeader;
      'sections.footer': SectionsFooter;
      'sections.features-section': SectionsFeaturesSection;
      'elements.link': ElementsLink;
      'elements.featur': ElementsFeatur;
    }
  }
}
