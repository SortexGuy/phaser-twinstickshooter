import { Types, defineComponent } from 'bitecs';

export const ArcadeSprite = defineComponent({
	texture: Types.ui8,
});

export const Position = defineComponent({
	x: Types.f32,
	y: Types.f32,
});

export const Velocity = defineComponent({
	x: Types.f32,
	y: Types.f32,
});

export const Player = defineComponent();
