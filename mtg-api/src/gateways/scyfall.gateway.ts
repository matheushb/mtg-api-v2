import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ScyfallGateway {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://api.scryfall.com/cards',
    });
  }

  async getDeckLeader(color: string) {
    return await this.axios.get(
      `search?q=type:legendary+type:creature${
        color ? `+color=${color}` : ''
      }&order=random`,
    );
  }

  async getDeckCards(colors: string) {
    return await this.axios.get(
      `search?q=color=${colors}+-type:legendary&order=random`,
    );
  }
}
