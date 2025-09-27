

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.getAllMenus();
  }

  @Get('hierarchy')
  getHierarchy() {
    return this.menuService.getMenuHierarchy();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('depth') depth?: string) {
    if (depth) {
      return this.menuService.getMenuWithDepth(id, parseInt(depth));
    }
    return this.menuService.getMenuById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}
