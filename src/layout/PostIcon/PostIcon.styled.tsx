import postIconWhiteUrl from '@/assets/post-icon-white.svg'
import postIconNavyUrl from '@/assets/post-icon-navy.svg'
import { styled } from '@mui/material'
import { ImgHTMLAttributes } from 'react'

export const PostIconWhite = styled(
  (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} src={postIconWhiteUrl} alt='post' />
  )
)(() => ({
  width: 16,
  height: 16,
  transform: 'rotateZ(-90deg) rotateX(180deg)',
}))

export const PostIconNavy = styled(
  (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} src={postIconNavyUrl} alt='post' />
  )
)(() => ({
  width: 16,
  height: 16,
  transform: 'rotateZ(-90deg) rotateX(180deg)',
}))
